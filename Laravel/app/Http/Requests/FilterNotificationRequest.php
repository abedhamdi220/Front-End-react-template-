<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilterNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search'   => ['nullable', 'string', 'max:255'],
            'filter'   => ['nullable', 'in:all,read,unread'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
