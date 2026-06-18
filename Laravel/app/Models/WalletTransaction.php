<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\WalletTransactionType;
use App\Enums\WalletTransactionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class WalletTransaction extends Model
{
    protected $fillable = ['wallet_id', 'type', 'amount', 'method', 'status', 'reference_id', 'meta'];

    protected $casts = [
        'amount' => 'decimal:2',
        'type' => WalletTransactionType::class,
        'status' => WalletTransactionStatus::class,
        'method' => PaymentMethod::class,
        'meta' => 'json',
    ];

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query->when($filters['type'] ?? null, fn($q, $type) => $q->where('type', $type))
            ->when($filters['date_from'] ?? null, fn($q, $df) => $q->whereDate('created_at', '>=', $df))
            ->when($filters['date_to'] ?? null, fn($q, $dt) => $q->whereDate('created_at', '<=', $dt))
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status));
    }
}
