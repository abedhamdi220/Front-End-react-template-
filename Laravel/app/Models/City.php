<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class City extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = ['name','country_id'];

    public $translatable = ['name'];

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }
    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}
