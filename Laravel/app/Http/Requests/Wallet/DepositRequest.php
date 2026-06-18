<?php

namespace App\Http\Requests\Wallet;

use Illuminate\Foundation\Http\FormRequest;

class DepositRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
             'customer_id' => 'required|exists:customers,id',
            'amount'      => 'required|numeric|min:1',
            'description' => 'nullable|string|max:255',
        ];
    }
}