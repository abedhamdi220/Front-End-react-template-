<?php

namespace App\Services\Payment;

use App\Enums\PaymentMethod;
use App\Services\Payment\Strategies\CashPaymentStrategy;
use App\Services\Payment\Strategies\StripePaymentStrategy;
use App\Services\Payment\Strategies\WalletPaymentStrategy;
use App\Interfaces\PaymentStrategyInterface;
use InvalidArgumentException;

class PaymentFactory
{
    public function make(string $paymentMethod): PaymentStrategyInterface
    {
        return match ($paymentMethod) {
            PaymentMethod::WALLET->value => app(WalletPaymentStrategy::class),
            PaymentMethod::CARD->value   => app(StripePaymentStrategy::class),
            PaymentMethod::CASH->value   => app(CashPaymentStrategy::class),
            default => throw new InvalidArgumentException("Payment method not supported: {$paymentMethod}"),
        };
    }
}
