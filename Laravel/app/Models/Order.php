<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;
    public $translatable = ['note'];
    protected $fillable = [
        'customer_id',
        'address_id',
        'designs_total',
        'shipping_cost',
        'tax',
        'grand_total',
        'status',
        'payment_method',
        'session_id',
        'coupon_id',
        'discount_amount',
        'transaction_id',
        'payment_status',
        'note',
        'order_number'
    ];
    protected $casts = [
        'status' => OrderStatus::class,
        'payment_method' => PaymentMethod::class,
        'payment_status' => PaymentStatus::class,

    ];
    public function getFormattedOrderNumberAttribute(): string
    {
        return '#' . ($this->order_number ?? $this->id);
    }
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    public function items()
    {
        return $this->hasMany(Item::class);
    }
    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }
    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
    public function address()
    {
        return $this->belongsTo(Address::class);
    }
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        $query->when($filters['search'] ?? null, function ($q, $search) {
            $q->where(function ($subQ) use ($search) {
                if (is_numeric($search)) {
                    $subQ->where('order_number', 'like', "%{$search}%")
                        ->orWhere('id', $search);
                }

                $subQ->orWhereHas('customer', function ($c) use ($search) {
                    $c->where('phone', 'like', "%{$search}%")
                        ->orWhereHas('profile', function ($p) use ($search) {
                            $locale = app()->getLocale();
                            $p->where("name->{$locale}", 'like', "%{$search}%")
                                ->orWhere('name', 'like', "%{$search}%");
                        });
                });
            });
        });

        $query->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status));

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        if (!empty($filters['min_total']) && is_numeric($filters['min_total'])) {
            $query->where('grand_total', '>=', (float) $filters['min_total']);
        }
        if (!empty($filters['max_total']) && is_numeric($filters['max_total'])) {
            $query->where('grand_total', '<=', (float) $filters['max_total']);
        }

        $query->when($filters['design_id'] ?? null, function ($q, $designId) {
            $q->whereHas('items', fn($itemQ) => $itemQ->where('design_id', $designId));
        });

        return $query;
    }
}
