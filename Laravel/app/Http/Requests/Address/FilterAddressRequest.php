<?php

namespace App\Http\Requests\Address;

use Illuminate\Foundation\Http\FormRequest;

class FilterAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
           'search'      => ['nullable', 'string'],
           'city_id'     => ['nullable', 'exists:cities,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'street' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'in:id,created_at,city_id,is_default'],
            'sort_dir' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
