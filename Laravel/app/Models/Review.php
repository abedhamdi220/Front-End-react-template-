<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Review extends Model
{
    use  HasTranslations;
     public $translatable = ['comment'];
      protected $fillable = ['rating','comment','reviewable_type', 'reviewable_id', 'customer_id'];

   protected $casts = [
        'rating' => 'integer',
    ];
    public function reviewable()
    {
        return $this->morphTo();
    }
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
