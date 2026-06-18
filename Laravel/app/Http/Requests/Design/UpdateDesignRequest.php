<?php

namespace App\Http\Requests\Design;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDesignRequest extends FormRequest
{
    public function authorize(): bool
    {
        $design = $this->route('design');
        return $this->user()->can('update', $design);
    }

    protected function prepareForValidation()
    {
        if ($this->input('images') === 'null' || $this->input('images') === 'undefined') {
            $this->merge(['images' => null]);
        }
        if ($this->input('options') === 'null' || $this->input('options') === 'undefined') {
            $this->merge(['options' => null]);
        }
    }

    public function rules(): array
    {
        $supported_locales = config("app.supported_locales");

        $rules = [
            'name' => ['array', 'sometimes'],
            'description' => ['sometimes', 'array', 'nullable'],
            'size_id' => ['sometimes', 'integer', 'exists:sizes,id'],
            'total_price' => ['sometimes', 'numeric', 'min:0'],
            'options'            => ['sometimes', 'nullable', 'array'],
            'options.*.id'       => ['required_with:options', 'integer', 'exists:design_options,id'],
            'images'   => ['sometimes', 'nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif', 'max:5000'],
        ];

        if (is_array($supported_locales)) {
            foreach ($supported_locales as $locale) {
                $rules['name.' . $locale]        = ['sometimes', 'string', 'max:255'];
                $rules['description.' . $locale] = ['sometimes', 'nullable', 'string', 'max:1000'];
            }
        }

        return $rules;
    }
}
