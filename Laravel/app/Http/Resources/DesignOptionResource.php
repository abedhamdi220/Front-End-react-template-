<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DesignOptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = app()->getLocale();
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'price_adjustment' => (float) $this->pivot->price_at_purchase ?? 0,
            'quantity' => (int) $this->pivot->quantity ?? 1,
        ];
    }
}
