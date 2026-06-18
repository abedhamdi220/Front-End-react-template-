<?php

namespace App\Http\Requests\Coupon;

use Illuminate\Foundation\Http\FormRequest;

class FilterCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search'    => ['nullable', 'string', 'max:50'],
            'is_active' => ['nullable', 'boolean'],
            'type'      => ['nullable', 'string'],
            'per_page'  => ['nullable', 'integer', 'min:1', 'max:100'],
            'sort_by'   => ['nullable', 'string', 'in:code,created_at,end_date'],
            'sort_dir'  => ['nullable', 'string', 'in:asc,desc'],
            'status'   => ['nullable', 'boolean'],
        ];
    }
}
