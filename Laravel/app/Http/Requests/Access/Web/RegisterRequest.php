<?php

namespace App\Http\Requests\Access\Web;

use Illuminate\Foundation\Http\FormRequest;


class RegisterRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

 
    public function rules()
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:admins'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'profile_image' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif,svg,webp',
                'max:2048'
            ],

        ];

        return $rules;
    }
}
