<?php

namespace App\Http\Requests\Wallet;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;

class WithdrawRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
             'customer_id' => 'required|exists:customers,id',
            'amount'      => [
                'required', 
                'numeric', 
                'min:1',
                function ($attribute, $value, $fail) {
                    $customer = Customer::with('wallet')->find($this->input('customer_id'));
                    if (!$customer || !$customer->wallet || $customer->wallet->balance < $value) {
                        $fail(__('The withdrawal amount exceeds the customer\'s current balance.'));
                    }
                },
            ],
            'description' => 'nullable|string|max:255',
        ];
    }
}