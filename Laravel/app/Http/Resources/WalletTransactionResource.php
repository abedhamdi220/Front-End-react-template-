<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isCredit = in_array($this->type->value, ['deposit', 'refund']);
        $sign = $isCredit ? '+' : '-';

        return [
            'id' => $this->id,
            'amount' => (float) $this->amount,
            'formatted_amount' => $sign . number_format($this->amount, 2) . ' ' . __('messages.currency_aed'),
            'type' => $this->type->value,
            'type_label' => __('wallet.types.' . $this->type->value),
            'status' => $this->status->value,
            'status_label' => __('wallet.status.' . $this->status->value),
            'meta' => [
                'description' => $this->meta['description'] ?? null,
                'reference_id' => $this->reference_id,
            ],
            'date' => $this->created_at->format('Y-m-d'),
            'time' => $this->created_at->format('h:i A'),
            'created_at_human' => $this->created_at->diffForHumans(),
        ];
    }
}
