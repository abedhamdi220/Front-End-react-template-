<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $order = $this->order;
        $downloadUrl = URL::signedRoute('invoice.download.public', [
            'order' => $order->id
        ]);

        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'status' => $this->status,
            'total_amount' => (float) $this->total_amount,
            'currency' => 'AED',
            'issued_date' => $this->issued_at->format('Y-m-d h:i A'),

            'order_ref' => $order->order_number,
            'items_count' => $order->items->count(),

            'pdf_url' => $downloadUrl,

            'items' => ItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
