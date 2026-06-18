<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'design' => new DesignResource($this->whenLoaded('design')),
            'size' => new SizeResource($this->whenLoaded('size')),
            'options' => DesignOptionResource::collection($this->whenLoaded('selectedOptions')),
            'quantity' => (int) ($this->quantity ?? 1),
            'unit_price' => isset($this->unit_price) ? (float) $this->unit_price : 0.0,
            'subtotal' => isset($this->subtotal) ? (float) $this->subtotal : 0.0,
        ];
    }
}
