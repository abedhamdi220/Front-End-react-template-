<?php

namespace App\Http\Resources;

use App\Http\Resources\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
             'id' => $this->id,
            'rating' => (int) $this->rating,
            'comment' => $this->comment,
            'customer'=>new ProfileResource($this->whenLoaded('customer')),
            'created_at' => $this->created_at->format("Y-m-d H:i:s"),
        ];
    }
}
