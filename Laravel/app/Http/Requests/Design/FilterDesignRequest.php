<?php

namespace App\Http\Requests\Design;

use Illuminate\Foundation\Http\FormRequest;

class FilterDesignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'search'      => ['nullable', 'string', 'max:255'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'size_id'     => ['nullable', 'exists:sizes,id'],
            'option_id'   => ['nullable', 'exists:design_options,id'], // تمت إضافته
            'min_price'   => ['nullable', 'numeric', 'min:0'],        // تمت إضافته
            'max_price'   => ['nullable', 'numeric', 'gte:min_price'], // تمت إضافته
            'date_from'   => ['nullable', 'date'],
            'date_to'     => ['nullable', 'date', 'after_or_equal:date_from'],
            'per_page'    => ['nullable', 'integer', 'min:1', 'max:100'],
            'sort_by'     => ['nullable', 'string', 'in:created_at,total_price,status'],
            'sort_dir'    => ['nullable', 'string', 'in:asc,desc'],
        ];
    }
}
