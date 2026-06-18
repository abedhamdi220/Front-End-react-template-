<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Size extends Model

{
    use HasTranslations;
    public array $translatable = ['name'];
    protected $fillable = ['name', 'code'];
    
    public function designs()
    {
        return $this->hasMany(Design::class);
    }
}
