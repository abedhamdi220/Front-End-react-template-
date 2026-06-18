<?php

namespace App\Http\Requests\Access\Api;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supported_locales = config("app.supported_locales");

        $rules = [
            'name'          => ['required', 'array'],
            'phone'         => ['required', 'string', 'max:25', 'unique:customers'],
            'password'      => ['required', 'string', 'min:8', 'confirmed'],
            'profile_image' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif,svg,webp',
                'max:2048'
            ],
        ];

        foreach ($supported_locales as $locale) {
            $rules['name.' . $locale] = ['required', 'string', 'max:255'];
        }

        return $rules;
    }
}
