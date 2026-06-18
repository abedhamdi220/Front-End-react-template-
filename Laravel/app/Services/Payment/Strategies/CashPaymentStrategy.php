<?php

namespace App\Services\Payment\Strategies;

use App\Interfaces\PaymentStrategyInterface;
use App\Models\Customer;
use App\Models\Order;

class CashPaymentStrategy implements PaymentStrategyInterface
{
    public function pay(Order $order, Customer $customer): array
    {
        return ['payment_message' => 'pay after resive'];
    }
}
