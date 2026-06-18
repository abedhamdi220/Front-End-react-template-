<?php

namespace App\Http\Requests\Order;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Support\Facades\DB;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address_id'        => ['required', 'exists:addresses,id'],
            'note'              => ['nullable', 'string', 'max:1000'],
            'items'             => ['required', 'array', 'min:1'],
            'items.*.design_id' => ['required', 'exists:designs,id'],
            'items.*.quantity'  => ['nullable', 'integer', 'min:1'],
            'items.*.size_id'   => ['nullable', 'exists:sizes,id'],
            'items.*.options'   => [
                'nullable',
                'array',
                function ($attribute, $value, $fail) {
                    $index = explode('.', $attribute)[1];


                    $designId = $this->input("items.{$index}.design_id");

                    if (!$designId) {
                        return;
                    }

                    $validCount = DB::table('design_design_option')
                        ->where('design_id', $designId)
                        ->whereIn('design_option_id', $value)
                        ->count();

                    if ($validCount !== count(array_unique($value))) {
                        $fail(__('The selected options are not available for this design.'));
                    }
                }
            ],
            'items.*.options.*' => ['exists:design_options,id'],

            'payment_method'    => ['nullable', new Enum(PaymentMethod::class)],
            'coupon_code'       => ['nullable', 'string', 'exists:coupons,code'],
        ];
    }

    public function messages()
    {
        return [
            'items.*.options.custom' => __('Some selected options do not belong to the chosen design.'),
        ];
    }
}
