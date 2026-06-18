<?php

namespace App\Http\Requests\Address;

use Illuminate\Foundation\Http\FormRequest;


class UpdateAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        $address = $this->route('address');
        return  auth('customer')->user()->can('update', $address);
    }

  public function rules(): array
    {
        $supported_locales = config("app.supported_locales", ['en', 'ar']);

        $rules = [
            'city_id'      => ['nullable','sometimes', 'exists:cities,id'],
            'country_id'   => ['nullable','sometimes', 'exists:countries,id'],
            'street'       => ['nullable','sometimes', 'array'],
            'details'      => ['nullable', 'array'],
            'house_number' => ['nullable','sometimes', 'string', 'max:50'],
            'latitude'     => ['nullable','sometimes', 'numeric'],
            'longitude'    => ['nullable','sometimes', 'numeric'],
            'is_default'   => ['nullable','sometimes', 'boolean'],
        ];

        foreach ($supported_locales as $locale) {
            $rules['street.' . $locale]  = ['required', 'string', 'max:255'];
            $rules['details.' . $locale] = ['required', 'string', 'max:1000'];
        }

        return $rules;
    }
}
