<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Address extends Model
{
    use SoftDeletes, HasFactory, HasTranslations;

    public $translatable = ['details', 'street'];

    protected $fillable = [
        'customer_id',
        'country_id',
        'city_id',
        'street',
        'details',
        'is_default',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'is_default' => 'boolean',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function scopeFilter(Builder $q, array $filters): Builder
    {
        $locale = app()->getLocale();

        if (!empty($filters['q'])) {
            $q->where(function ($sub) use ($filters, $locale) {
                $sub->where("street->{$locale}", 'like', '%' . $filters['q'] . '%')
                    ->orWhere("details->{$locale}", 'like', '%' . $filters['q'] . '%')
                    ->orWhereHas('customer.profile', function ($u) use ($filters, $locale) {
                        $u->where("name->{$locale}", 'like', '%' . $filters['q'] . '%')
                          ->orWhere("name", 'like', '%' . $filters['q'] . '%');
                    });
            });
        }

        if (!empty($filters['city'])) {
            $q->where('city_id', $filters['city']);
        }

        return $q;
    }

    public function scopeSort(Builder $q, ?string $sortBy, ?string $sortDir = 'asc'): Builder
    {
        if (!$sortBy) return $q->orderBy('created_at', 'desc');
        return $q->orderBy($sortBy, $sortDir);
    }
}
