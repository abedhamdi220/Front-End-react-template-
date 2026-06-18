<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\MediaResource;
use Illuminate\Http\Resources\Json\JsonResource;

class DesignResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => [
                'amount' => (float) $this->total_price,
                'currency' => 'AED',
            ],
            'is_active' => $this->is_active,
            'size' => $this->whenLoaded('size', function () {
                return $this->size->type;
            }),
            'customer' => $this->whenLoaded('customer', function () {
                return [
                    'id' => $this->customer->id,
                    'name' => $this->customer->name,
                ];
            }),
            'options' => DesignOptionResource::collection($this->whenLoaded('options')),
            'media'   => MediaResource::collection($this->whenLoaded('media')),
            'reviews'=> ReviewResource::collection($this->whenLoaded('reviews')),
            "created_at" => $this->created_at->format("Y-m-d H:i:s"),
            "updated_at" => $this->updated_at->format("Y-m-d H:i:s"),
        ];
    }
}
