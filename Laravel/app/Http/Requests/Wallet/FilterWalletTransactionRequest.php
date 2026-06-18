<?php

namespace App\Http\Requests\Wallet;

use Illuminate\Foundation\Http\FormRequest;


class FilterWalletTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type'       => ['nullable', 'string'],
            'status'     => ['nullable', 'string'],
            'date_from'  => ['nullable', 'date'],
            'date_to'    => ['nullable', 'date', 'after_or_equal:date_from'],
            'per_page'   => ['nullable', 'integer', 'min:1', 'max:100'],
            'sort_dir'   => ['nullable', 'in:asc,desc'],
        ];
    }
}
