<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;


class UpdateAdminProfileRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        $type = $this->input('update_type', 'general');

        return match ($type) {
            'password' => $this->passwordRules(),
            default    => $this->generalRules(),
        };
    }


    protected function generalRules(): array
    {
        return [
            'name'          => ["sometimes", 'nullable', 'string', 'max:255'],
            'job_title'     => ["sometimes", 'nullable', 'string', 'max:100'],
            'country_id'    => ["sometimes", 'nullable', 'exists:countries,id'],
            'address'       => ["sometimes", 'nullable', 'string', 'max:255'],
            'bio'           => ["sometimes", 'nullable', 'string', 'max:1000'],


            'profile_image' => [
                "sometimes",
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif,svg,webp',
                'max:2048'
            ],
        ];
    }


    protected function passwordRules(): array
    {
        return [
            'current_password' => ['required', 'current_password:admin'],
            'password'         => ['required', 'confirmed', Password::defaults()],
        ];
    }



    public function messages(): array
    {
        return [
//
        ];
    }
}
