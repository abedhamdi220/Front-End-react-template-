<?php

namespace App\Http\Requests\Access\Web;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
          'email'=> 'required|string|exists:admins,email',
          'password'=> 'required|string',
        ];
    }
}
