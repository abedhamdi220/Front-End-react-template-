<?php

namespace App\Services\Payment\Strategies;

use App\Interfaces\PaymentStrategyInterface;
use App\Models\Customer;
use App\Models\Order;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class StripePaymentStrategy implements PaymentStrategyInterface
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
    }
    public function pay(Order $order, Customer $customer): array
    {
        $lineItems = $this->prepareLineItems($order);

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'customer_email' => $customer->email ?? null,
            'mode' => 'payment',
            'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel'),
            'metadata' => [
                'order_id' => $order->id,
                'customer_id' => $customer->id,
                'type' => 'order_payment'
            ]
        ]);

        $order->update([
            'session_id' => $session->id,
            'payment_status' => 'unpaid'
        ]);

        return [
            'payment_status' => 'unpaid',
            'action_required' => true,
            'action_type' => 'redirect',
            'redirect_url' => $session->url,
            'message' => 'Redirecting to payment gateway...'
        ];
    }
    private function prepareLineItems(Order $order): array
    {
        $lineItems = [];
        $currency = 'aed';

        foreach ($order->items as $item) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => $currency,
                    'unit_amount' => (int)($item->unit_price * 100),
                    'product_data' => [
                        'name' => $item->design->name ?? 'Design #' . $item->design_id,
                    ],
                ],
                'quantity' => $item->quantity,
            ];
        }
        return $lineItems;
    }
}
