<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ProfileResource;
use App\Http\Resources\AddressResource;
use App\Http\Resources\ItemResource;
use App\Http\Resources\ReviewResource;

class OrderResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'order_number'     => $this->order_number,
            'formatted_number' => $this->formatted_order_number,
            'customer_id'      => $this->customer_id,

            'customer'         => new ProfileResource($this->whenLoaded('customer')),
            'address'          => new AddressResource($this->whenLoaded('address')),

            'note'             => $this->note,

            'status'           => $this->status?->value ?? $this->status,
            'status_label'     => $this->status ? __('statuses.' . $this->status->value) : null,

            'payment_method'   => $this->payment_method?->value ?? $this->payment_method,
            'payment_status'   => $this->payment_status?->value ?? $this->payment_status,

            'shipping_cost'    => (float) ($this->shipping_cost ?? 0),
            'tax'              => (float) ($this->tax ?? 0),
            'designs_total'    => (float) ($this->designs_total ?? 0),
            'discount_amount'  => (float) ($this->discount_amount ?? 0),
            'grand_total'      => (float) ($this->grand_total ?? 0),

            'items'            => $this->whenLoaded('items', function () {
                return ItemResource::collection($this->items);
            }),

            'reviews'          => $this->whenLoaded('reviews', function () {
                return ReviewResource::collection($this->reviews);
            }),

            'created_at'       => $this->created_at->format("Y-m-d H:i:s"),
            'updated_at'       => $this->updated_at->format("Y-m-d H:i:s"),
        ];
    }
}
