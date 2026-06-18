<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'order_id',
        'design_id',
        'size_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];
    protected $casts = [
        'unit_price' => 'float',
        'subtotal' => 'float',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }


    public function design()
    {
        return $this->belongsTo(Design::class);
    }

    public function size()
    {
        return $this->belongsTo(Size::class);
    }
    public function selectedOptions()
    {
        return $this->belongsToMany(
            DesignOption::class,
            'item_design_options',
            'item_id',
            'design_option_id'
        )->withTimestamps();
    }
}
