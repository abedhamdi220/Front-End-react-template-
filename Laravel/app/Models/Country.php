<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Country extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = ['name'];

    protected $fillable = [
        'name',
        'code',
        'is_default'
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];


    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function cities(): HasMany
    {
        return $this->hasMany(City::class);
    }
}
