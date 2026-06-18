<?php

namespace App\Services;

use App\Models\Wallet;
use App\Models\Customer;
use App\Enums\PaymentMethod;
use Illuminate\Support\Facades\DB;
use App\Enums\WalletTransactionType;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WalletService
{
    public function list(array $filters = [])
    {
        $perPage = $filters['per_page'] ?? $filters['perPage'] ?? 10;

        return Customer::with('wallet')
            ->filter($filters)
            ->latest()
            ->paginate($perPage);
    }

    public function getWalletBalance(Customer $customer): Wallet
    {
        return Wallet::firstOrCreate([
            'customer_id' => $customer->id
        ], [
            'balance' => 0
        ]);
    }

    public function getTransactions(Customer|int $customer, array $filters = []): LengthAwarePaginator
    {
        if (is_int($customer)) {
            $customer = Customer::findOrFail($customer);
        }
        $wallet = $this->getWalletBalance($customer);

        return $wallet->transactions()
            ->filter($filters)
            ->orderBy($filters['sort_by'] ?? 'created_at', $filters['sort_dir'] ?? 'desc')
            ->paginate($filters['per_page'] ?? 15);
    }


    private function getLockedWallet(Customer $customer): Wallet
    {
        $wallet = Wallet::where('customer_id', $customer->id)->lockForUpdate()->first();

        if (!$wallet) {
            $wallet = Wallet::create([
                'customer_id' => $customer->id,
                'balance' => 0
            ]);
            $wallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();
        }

        return $wallet;
    }

    public function deposit(Customer $customer, float $amount, string $description = null, $referenceType = null, $referenceId = null, $method = 'system')
    {
        return DB::transaction(function () use ($customer, $amount, $description, $referenceType, $referenceId, $method) {

            $wallet = $this->getLockedWallet($customer);

            $meta = [
                'description' => $description,
                'reference_type' => $referenceType
            ];

            $wallet->deposit($amount, $meta, $referenceId, $method);

            return $wallet;
        });
    }

    public function withdraw(Customer $customer, float $amount, string $description = null, $referenceType = null, $referenceId = null, $method = 'system')
    {
        return DB::transaction(function () use ($customer, $amount, $description, $referenceType, $referenceId, $method) {

            $wallet = $this->getLockedWallet($customer);
            $meta = [
                'description' => $description,
                'reference_type' => $referenceType
            ];

            $wallet->withdraw($amount, WalletTransactionType::WITHDRAW, $meta, $referenceId, $method);

            return $wallet;
        });
    }

    public function payOrder(Customer $customer, float $amount, int $orderId)
    {
        return DB::transaction(function () use ($customer, $amount, $orderId) {

            $wallet = $this->getLockedWallet($customer);

            $wallet->withdraw(
                $amount,
                WalletTransactionType::PAYMENT,
                ['description' => "Payment for Order #{$orderId}"],
                $orderId,
                PaymentMethod::WALLET->value
            );

            return true;
        });
    }
}
