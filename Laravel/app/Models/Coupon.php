<?php

namespace App\Models;

use App\Enums\CouponType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Coupon extends Model
{

    protected $table = 'coupons';

    protected $fillable = [
        'code',
        'type',
        'value',
        'limit',
        'quantity',
        'max_usage_per_user',
        'min_purchase',
        'expires_at',
        'is_enabled',
    ];

    protected $casts = [
        'type' => CouponType::class,
        'expires_at' => 'datetime',
        'is_enabled' => 'boolean',
        'value'      => 'float',
        'quantity'   => 'integer',
        'limit'      => 'integer',
        'min_purchase' => 'float',
    ];

    public function usages()
    {
        return $this->hasMany(CouponUsage::class);
    }
    public function scopeFilter(Builder $query, array $filters)
    {
        $query->when($filters['search'] ?? $filters['q'] ?? null, function ($q, $search) {
            $q->where(function ($subQ) use ($search) {
                $subQ->where('code', 'like', "%{$search}%")
                    ->orWhere('value', 'like', "%{$search}%");
            });
        });

        $query->when($filters['type'] ?? null, function ($q, $type) {
            $q->where('type', $type);
        });
        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('is_enabled', filter_var($filters['status'], FILTER_VALIDATE_BOOLEAN));
        }
        if (isset($filters['is_active'])) {
            $query->where('is_enabled', $filters['is_active']);
        }

        return $query;
    }
    public function calculateDiscount(float $totalAmount): float
    {
        if ($this->type === CouponType::PERCENTAGE || $this->type->value === 'percentage') {
            $discount = ($totalAmount * $this->value) / 100;
            return $discount;
        }
        return min($this->value, $totalAmount);
    }
    public function isValidFor($customer)
    {
        if (!$this->is_enabled) {
            return "messages.coupon_disabled";
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return "messages.coupon_expired";
        }

        if ($this->limit > 0 && $this->quantity >= $this->limit) {
            return "messages.coupon_limit_reached";
        }

        if ($this->max_usage_per_user > 0) {
            $userUsageCount = $this->usages()->where('customer_id', $customer->id)->count();
            if ($userUsageCount >= $this->max_usage_per_user) {
                return "messages.coupon_user_limit_reached";
            }
        }

        return true;
    }
}
