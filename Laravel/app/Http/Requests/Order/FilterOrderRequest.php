<?php

namespace App\Http\Requests\Order;

use App\Enums\OrderStatus;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class FilterOrderRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'search'         => ['nullable', 'string'],
            'status'         => ['nullable', new Enum(OrderStatus::class)],
            'payment_status' => ['nullable', 'string'],
            'customer_id'    => ['nullable', 'exists:customers,id'],
            'date_from'      => ['nullable', 'date'],
            'date_to'        => ['nullable', 'date', 'after_or_equal:date_from'],
            'per_page'       => ['nullable', 'integer', 'min:1', 'max:100'],
            'sort_by'        => ['nullable', 'string', 'in:created_at,grand_total,status'],
            'sort_dir'       => ['nullable', 'string', 'in:asc,desc'],
        ];
    }
}
