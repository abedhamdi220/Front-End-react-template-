<?php

namespace App\Http\Requests\Design;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\DesignOptionType;
use Illuminate\Validation\Rules\Enum;

class UpdateDesignOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name.ar' => ['required', 'string', 'max:255'],
            'name.en' => ['required', 'string', 'max:255'],
            'type'    => ['required', new Enum(DesignOptionType::class)],
            'image'   => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:4000'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [];
    }
}
