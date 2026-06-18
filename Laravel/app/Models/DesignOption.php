<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Builder;
use App\Enums\DesignOptionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\Translatable\HasTranslations;

class DesignOption extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'type',
        'name',
        'price_adjustment',
        'is_active',
    ];

    public $translatable = ['name'];

    protected $casts = [
        'type' => DesignOptionType::class,
        'is_active' => 'boolean',
        'price_adjustment' => 'decimal:2',
    ];


    public function media(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediable');
    }

    public function getImageUrlAttribute()
    {
        if ($this->media) {
            return $this->media->file_url;
        }
        return asset('assets/img/no-image.png');
    }

  public function scopeFilter(Builder $query, array $filters)
    {
        return $query->when($filters['type'] ?? null, function ($q, $type) {
            $q->where('type', $type);
        })
        ->when($filters['search'] ?? null, function ($q, $search) {
            $q->where(function ($subQ) use ($search) {
                $subQ->where('name->ar', 'like', "%{$search}%")
                     ->orWhere('name->en', 'like', "%{$search}%");
            });
        });
    }
}
