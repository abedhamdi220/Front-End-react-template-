<?php

namespace App\Http\Requests\Design;

use Illuminate\Foundation\Http\FormRequest;

class FilterDesignOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search'   => ['nullable', 'string', 'max:255'],
            'type'     => ['nullable', 'string'], 
            'is_active' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'sort_by'  => ['nullable', 'string', 'in:id,name,created_at,price_modifier'],
            'sort_dir' => ['nullable', 'string', 'in:asc,desc'],
        ];
    }
}
