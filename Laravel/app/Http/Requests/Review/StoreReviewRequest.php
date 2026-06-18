<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReviewRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supported_locales = config("app.supported_locales", ['en', 'ar']);
        $rules = [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'array'],
            'type' => ['required', 'string', Rule::in(['order', 'design'])],
            'id' => ['required', 'integer'],
            'order_number' => ['required_if:type,order', 'string'],
        ];
        foreach ($supported_locales as $locale) {
            $rules['comment.' . $locale] = ['required', 'string', 'max:1000'];
        }

        return $rules;
    }
}
