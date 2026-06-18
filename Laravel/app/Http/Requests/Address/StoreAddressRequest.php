<?php

namespace App\Http\Requests\Address;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supported_locales = config("app.supported_locales", ['en', 'ar']);

        $rules = [
            'city_id'      => ['required', 'exists:cities,id'],
            'country_id'   => ['nullable', 'exists:countries,id'],
            'street'       => ['required', 'array'],
            'details'      => ['nullable', 'array'],
            'house_number' => ['required', 'string', 'max:50'],
            'latitude'     => ['nullable', 'numeric'],
            'longitude'    => ['nullable', 'numeric'],
            'is_default'   => ['nullable', 'boolean'],
        ];

        foreach ($supported_locales as $locale) {
            $rules['street.' . $locale]  = ['required', 'string', 'max:255'];
            $rules['details.' . $locale] = ['nullable', 'string', 'max:1000'];
        }

        return $rules;
    }
}
