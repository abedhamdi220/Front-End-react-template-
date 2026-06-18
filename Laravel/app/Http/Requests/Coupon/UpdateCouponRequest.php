<?php

namespace App\Http\Requests\Coupon;

use App\Enums\CouponType;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCouponRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
            return [
            'code' => ['required', 'string', 'max:64', Rule::unique('coupons')->ignore($this->coupon)],
            'type' => ['required', new Enum(CouponType::class)],
            'value' => [
                'required',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) {
                    if ($this->type === 'percentage' && $value > 100) {
                        $fail('The percentage value cannot exceed 100.');
                    }
                },
            ],
            'limit' => ['nullable', 'integer', 'min:1'],
            'max_usage_per_user' => ['nullable', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date'],
            'is_enabled' => ['boolean'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'is_enabled' => $this->has('is_enabled') ? 1 : 0,
        ]);
    }


}
