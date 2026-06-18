<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Services\Payment\PaymentFactory;
use App\Events\OrderCreated;
use App\Models\Coupon;
use App\Models\Design;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        protected PaymentFactory $paymentFactory,
        protected CouponService $couponService
    ) {}

    public function list(array $filters = [], $customerId = null)
    {
        $perPage = $filters['per_page'] ?? $filters['perPage'] ?? 10;

        $query = Order::with(['items.design', 'items.size', 'items.selectedOptions', 'customer.profile', 'reviews']);

        return $query->filter($filters)
            ->latest()
            ->paginate($perPage);
    }

    public function handleOrderCreation(array $data, $customer)
    {
        $coupon = null;
        if (!empty($data['coupon_code'])) {
            $coupon = $this->couponService->validate($data['coupon_code'], $customer);
        }

        return DB::transaction(function () use ($data, $customer, $coupon) {
            $shippingCost = config('shop.shipping_cost', 20.00);

            $order = Order::create([
                'customer_id'    => $customer->id,
                'address_id'     => $data['address_id'],
                'note'           => $data['note'] ?? null,
                'status'         => OrderStatus::PENDING,
                'payment_method' => $data['payment_method'] ?? PaymentMethod::CASH->value,
                'shipping_cost'  => $shippingCost,
                'designs_total'  => 0,
                'grand_total'    => 0,
                'payment_status' => PaymentStatus::UNPAID,
                'coupon_id'      => $coupon?->id,
            ]);

            $designsTotal = $this->processOrderItems($order, $data['items']);

            $discountAmount = 0;
            if ($coupon) {
                if ($coupon->min_purchase > 0 && $designsTotal < $coupon->min_purchase) {
                    throw ValidationException::withMessages(['coupon_code' => __('messages.coupon_min_purchase_not_met')]);
                }
                $discountAmount = $this->couponService->apply($coupon, $order, $customer);
            }

            $subTotal = $designsTotal + $shippingCost;
            $grandTotal = max(0, $subTotal - $discountAmount);

            $order->update([
                'designs_total'   => $designsTotal,
                'grand_total'     => $grandTotal,
                'discount_amount' => $discountAmount,
            ]);

            $paymentMethodEnum = $order->payment_method instanceof PaymentMethod
                ? $order->payment_method->value
                : $order->payment_method;

            $paymentStrategy = $this->paymentFactory->make($paymentMethodEnum);
            $paymentResult = $paymentStrategy->pay($order, $customer);

            event(new OrderCreated($order));

            return [
                'order'   => $order->fresh()->load('items.selectedOptions', 'items.design', 'items.size', 'reviews'),
                'payment' => $paymentResult
            ];
        });
    }

    public function updateOrder(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            $oldGrandTotal = $order->grand_total;

            $order->fill([
                'address_id' => $data['address_id'] ?? $order->address_id,
                'note'       => $data['note'] ?? $order->note,
            ]);

            $designsTotal = $order->designs_total;

            if (isset($data['items'])) {

                $isCash = $order->payment_method === PaymentMethod::CASH;
                $isUnpaid = $order->payment_status === PaymentStatus::UNPAID;

                if (!$isCash && !$isUnpaid) {
                    throw new \Exception(__('messages.Cannot update order items for paid orders.'));
                }
                $order->items()->delete();
                $designsTotal = $this->processOrderItems($order, $data['items']);
            }

            $discountAmount = 0;
            if ($order->coupon_id) {
                $coupon = Coupon::find($order->coupon_id);
                if ($coupon) {
                    $discountAmount = $this->couponService->calculateOnly($coupon, $designsTotal);
                }
            }

            $order->designs_total   = $designsTotal;
            $order->discount_amount = $discountAmount;
            $order->grand_total     = max(0, ($designsTotal + $order->shipping_cost) - $discountAmount);

            if ($order->grand_total > $oldGrandTotal && $order->payment_status === PaymentStatus::PAID) {
                $order->payment_status = PaymentStatus::UNPAID;
            }

            $order->save();

            return $order->load('items.selectedOptions', 'items.design', 'items.size', 'reviews');
        });
    }

    public function deleteOrder(Order $order)
    {
        DB::transaction(function () use ($order) {
            $this->couponService->revertUsage($order);
            $order->delete();
        });
    }

    private function processOrderItems(Order $order, array $itemsData)
    {
        $totalPrice = 0;
        $designIds = array_column($itemsData, 'design_id');
        $designs = Design::whereIn('id', $designIds)->get()->keyBy('id');

        foreach ($itemsData as $itemData) {
            $design = $designs->get($itemData['design_id']);

            if (!$design) {
                throw new \Exception(__("messages.Design with ID {$itemData['design_id']} not found."));
            }

            $unitPrice = $design->total_price;
            $quantity = $itemData['quantity'] ?? 1;
            $lineSubtotal = $unitPrice * $quantity;

            $item = Item::create([
                'order_id'   => $order->id,
                'design_id'  => $design->id,
                'size_id'    => $itemData['size_id'] ?? $design->size_id ?? null,
                'quantity'   => $quantity,
                'unit_price' => $unitPrice,
                'subtotal'   => $lineSubtotal,
            ]);

            if (isset($itemData['options']) && !empty($itemData['options'])) {
                $item->selectedOptions()->attach($itemData['options']);
            } else {
                $defaultOptions = $design->options->pluck('id');
                $item->selectedOptions()->attach($defaultOptions);
            }
            $totalPrice += $lineSubtotal;
        }
        return $totalPrice;
    }
}
