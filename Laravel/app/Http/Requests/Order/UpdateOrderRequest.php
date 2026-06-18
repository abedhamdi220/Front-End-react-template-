<?php

namespace App\Http\Requests\Order;

use App\Enums\PaymentMethod;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = $this->route('order');
        return $this->user()->can('update', $order);
    }

    public function rules(): array
    {
        return [
            'address_id'        => ['nullable', 'exists:addresses,id'],
            'note'              => ['nullable', 'string', 'max:1000'],
            'items'             => ['nullable', 'array', 'min:1'],
            'items.*.design_id' => ['required_with:items', 'exists:designs,id'],
            'items.*.quantity'  => ['required_with:items', 'integer', 'min:1'],
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
        ];
    }
}
