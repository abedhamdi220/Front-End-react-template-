<?php

namespace App\Models;

use App\Enums\WalletTransactionStatus;
use App\Enums\WalletTransactionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Exception;

class Wallet extends Model
{
    protected $fillable = ['customer_id', 'balance'];

    protected $casts = [
        'balance' => 'double',

    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function transactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function scopeFilter(Builder $query, array $filters)
    {
        return $query->when($filters['min_balance'] ?? null, function ($q, $min) {
            $q->where('balance', '>=', $min);
        })
        ->when($filters['max_balance'] ?? null, function ($q, $max) {
            $q->where('balance', '<=', $max);
        });
    }


    public function deposit(float $amount, array $meta = [], $referenceId = null, $method = 'system'): void
    {
        $currentBalance = $this->balance;
        $newBalance = round($currentBalance + $amount, 2);

        $this->balance = $newBalance;
        $this->save();

        $this->transactions()->create([
            'type'         => WalletTransactionType::DEPOSIT->value,
            'amount'       => $amount,
            'method'       => $method,
            'status'       => WalletTransactionStatus::CONFIRMED->value,
            'reference_id' => $referenceId,
            'meta'         => array_merge($meta, ['balance_after' => $this->balance])
        ]);
    }


    public function withdraw(float $amount, WalletTransactionType $type, array $meta = [], $referenceId = null, $method = 'system'): self
    {
        if (round($this->balance, 2) < round($amount, 2)) {
            throw new Exception(__('messages.insufficient_balance'));
        }

        $currentBalance = $this->balance;
        $newBalance = round($currentBalance - $amount, 2);

        $this->balance = $newBalance;
        $this->save();

        $this->transactions()->create([
            'type'         => $type->value,
            'amount'       => $amount,
            'method'       => $method,
            'status'       => WalletTransactionStatus::CONFIRMED->value,
            'reference_id' => $referenceId,
            'meta'         => array_merge($meta, ['balance_after' => $this->balance])
        ]);

        return $this;
    }
}
