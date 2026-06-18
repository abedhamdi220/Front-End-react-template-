<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'balance' => (float) $this->balance,
            'formatted_balance' => number_format($this->balance, 2) . ' ' . __('messages.currency_aed'), // أو العملة الافتراضية
            'last_updated' => $this->updated_at?->diffForHumans(),
        ];
    }
}
