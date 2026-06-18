<?php

namespace App\Http\Requests\Administration;

use Illuminate\Foundation\Http\FormRequest;

class FilterRolePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
   public function prepareForValidation()
    {
        if ($this->has('q')) {
            $this->merge(['search' => $this->q]);
        }
    }

    public function rules(): array
    {
        return [
            'search'        => ['nullable', 'string', 'max:255'],
            'q'             => ['nullable', 'string', 'max:255'],
            'role'          => ['nullable', 'string', 'exists:roles,name'],
            'permission'    => ['nullable', 'string', 'exists:permissions,name'],
            'perPage'       => ['nullable', 'integer', 'min:1', 'max:100'],
            'per_page'      => ['nullable', 'integer', 'min:1', 'max:100'], 
        ];
    }

}
