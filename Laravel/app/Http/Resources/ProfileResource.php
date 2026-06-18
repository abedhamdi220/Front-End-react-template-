<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $profile = $this->relationLoaded('profile') ? $this->profile : null;

        $customer= [
            'id' => $this->id,
            'phone' => $this->phone,
            'name' => $profile ? $profile->name : null,
            'avatar' => $profile ? $profile->avatar_url : null,
            'location' => AddressResource::collection($this->whenLoaded('addresses')),
            'joined_at' => $this->created_at?->format("Y-m-d H:i:s"),
        ];
        if(isset($this->access_token)){
            $customer["token"] = $this->access_token;
        }
        return $customer;
    }
}
