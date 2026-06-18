<?php

namespace App\Http\Requests\Administration;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        $adminId = $this->route('admin')->id;

        return [
            'name'     => 'required|string|max:255',
            'email'    => ['required', 'email', Rule::unique('admins')->ignore($adminId)],
            'password' => 'nullable|min:8|confirmed',
        ];
    }
}