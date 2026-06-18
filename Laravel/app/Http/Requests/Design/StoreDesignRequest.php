<?php

namespace App\Http\Requests\Design;

use Illuminate\Foundation\Http\FormRequest;

class StoreDesignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if ($this->input('options') === 'null' || $this->input('options') === 'undefined') {
            $this->merge(['options' => null]);
        }
        if ($this->input('images') === 'null' || $this->input('images') === 'undefined') {
            $this->merge(['images' => null]);
        }
    }

    public function rules(): array
    {
        $supported_locales = config("app.supported_locales");

        $rules = [
            'name'              => ['required', 'array'],
            'description'       => ['nullable', 'array'],
            'size_id'           => ['required', 'integer', 'exists:sizes,id'],
            'total_price'       => ['required', 'numeric', 'min:0'],
            'options'           => ['nullable', 'array'],
            'options.*.id'      => ['required_with:options', 'integer', 'exists:design_options,id'],
            'images'            => ['nullable', 'array'],
            'images.*'          => ['image', 'mimes:jpeg,png,jpg,gif', 'max:5000'],
        ];

        foreach ($supported_locales as $locale) {
            $rules['name.' . $locale]        = ['required', 'string', 'max:255'];
            $rules['description.' . $locale] = ['nullable', 'string', 'max:1000'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            //
        ];
    }
}
