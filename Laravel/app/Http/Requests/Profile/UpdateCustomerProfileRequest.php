<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateCustomerProfileRequest extends FormRequest
{

    protected function prepareForValidation()
    {
        if ($this->input('profile_image') === 'null' || $this->input('profile_image') === 'undefined') {
            $this->merge(['profile_image' => null]);
        }
    }


    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customerId = Auth::guard('customer')->id();

        return [
            'name' => ['sometimes', 'array'],
            'password' => [
                'sometimes',
                'nullable',
                Password::defaults()
            ],
            'phone' => [
                'nullable',
                'sometimes',
                'string',
                'min:8',
                Rule::unique('customers', 'phone')->ignore($customerId),
            ],
            'profile_image' => ['sometimes', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'country_id' => ['sometimes', 'nullable', 'exists:countries,id'],
            'name.*' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
