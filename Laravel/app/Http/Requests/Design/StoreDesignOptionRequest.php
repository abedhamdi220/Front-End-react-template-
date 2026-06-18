<?php

namespace App\Http\Requests\Design;

use App\Enums\DesignOptionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDesignOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supported_locales = config("app.supported_locales");

        $rules = [
            'type'      => ['required', Rule::enum(DesignOptionType::class)],
            'name'      => ['required', 'array'],
            'is_active' => ['boolean'],
            'image'   => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:4000'],
        ];

        foreach ($supported_locales as $locale) {
            $rules['name.' . $locale] = ['required', 'string', 'max:255', 'min:3'];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            //
        ];
    }
}
