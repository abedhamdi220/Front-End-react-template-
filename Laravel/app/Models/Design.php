<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Design extends Model
{
    use HasFactory, HasTranslations, SoftDeletes;

    public $translatable = ['name', 'description'];
    protected $fillable = [
        'customer_id',
        'size_id',
        'name',
        'description',
        'total_price',
        'is_active'
    ];
    protected $casts = [
        'is_active' => 'boolean',
        'total_price' => 'decimal:2',
    ];
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    public function size()
    {
        return $this->belongsTo(Size::class);
    }
    public function options()
    {
        return $this->belongsToMany(DesignOption::class, 'design_design_option');
    }
    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }
    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }



    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }
    public function scopeOwnedBy(Builder $query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }
    public function scopeNotOwnedBy(Builder $query, $customerId)
    {
        return $query->where('customer_id', '!=', $customerId);
    }
    public function scopeFilter(Builder $query, array $filters)
    {

        if (isset($filters['min_price'])) {
            $query->where('total_price', '>=', $filters['min_price']);
        }
        if (isset($filters['max_price'])) {
            $query->where('total_price', '<=', $filters['max_price']);
        }
        if (isset($filters['size_id'])) {
            $query->where('size_id', $filters['size_id']);
        }
        if (isset($filters['option_id']) && $filters['option_id']) {
            $query->whereHas('options', function ($q) use ($filters) {
                $q->where('design_options.id', $filters['option_id']);
            });
        }
        if (isset($filters['search']) && $filters['search']) {
            $query->where(function ($q) use ($filters) {
                $locale = app()->getLocale();


                $q->where("name->{$locale}", 'like', '%' . $filters['search'] . '%')
                    ->orWhere("description->{$locale}", 'like', '%' . $filters['search'] . '%')
                    ->orWhereHas('customer', function ($c) use ($filters) {
                        $c->where('name', 'like', '%' . $filters['search'] . '%')
                            ->orWhere('phone', 'like', '%' . $filters['search'] . '%');
                    });
            });
        }
        return $query;
    }
}
