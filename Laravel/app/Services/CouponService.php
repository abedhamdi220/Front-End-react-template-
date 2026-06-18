<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Validation\ValidationException;

class CouponService
{
    public function list(array $filters = [])
    {
        $perPage = $filters['per_page'] ?? $filters['perPage'] ?? 10;

        return Coupon::filter($filters)
            ->latest()
            ->paginate($perPage);
    }
    public function validate(?string $code, Customer $customer)
    {
        if (empty($code)) {
            return null;
        }

        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            throw ValidationException::withMessages([
                'coupon_code' => __('messages.Invalid coupon code'),
            ]);
        }
        $validationResult = $coupon->isValidFor($customer);

        if ($validationResult !== true) {
            throw ValidationException::withMessages([
                'coupon_code' => __($validationResult),
            ]);
        }

        return $coupon;
    }

    public function apply(Coupon $coupon, Order $order, Customer $customer)
    {
        $discountAmount = $coupon->calculateDiscount($order->designs_total);
        $coupon->increment('quantity');

        CouponUsage::create([
            'coupon_id' => $coupon->id,
            'customer_id' => $customer->id,
            'order_id' => $order->id,
            'discount_amount' => $discountAmount
        ]);

        return $discountAmount;
    }

    public function revertUsage(Order $order)
    {
        if ($order->coupon_id) {
            $coupon = Coupon::find($order->coupon_id);
            if ($coupon) {
                if ($coupon->quantity > 0) {
                    $coupon->decrement('quantity');
                }
                CouponUsage::where('order_id', $order->id)->delete();
            }
        }
    }

    public function calculateOnly(Coupon $coupon, float $amount): float
    {
        return $coupon->calculateDiscount($amount);
    }


    public function createCoupon(array $data)
    {
        return Coupon::create($data);
    }

    public function updateCoupon(Coupon $coupon, array $data): bool
    {
        return $coupon->update($data);
    }

    public function deleteCoupon(Coupon $coupon): ?bool
    {
        return $coupon->delete();
    }
}
