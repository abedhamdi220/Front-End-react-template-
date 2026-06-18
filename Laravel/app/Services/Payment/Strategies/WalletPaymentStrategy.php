<?php

namespace App\Services\Payment\Strategies;

use App\Services\WalletService;
use App\Interfaces\PaymentStrategyInterface;
use App\Models\Customer;
use App\Models\Order;

class WalletPaymentStrategy implements PaymentStrategyInterface
{
    public function __construct(protected WalletService $walletService) {}
    public function pay(Order $order, Customer $customer): array
    {
        $this->walletService->payOrder($customer, $order->grand_total, $order->id);
        $order->update(['payment_status' => 'paid', 'status' => 'processing']);
        return [
            'payment_status' => 'paid',
            'action_required' => false,
            'action_type' => 'none',
            'redirect_url' => null,
            'message' => 'success payment using wallet'
        ];
    }
}
