<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {

        $supported_locales = config("app.supported_locales", ['en', 'ar']);
        $rules = [
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'comment' => ['sometimes', 'nullable', 'array'],
        ];

        foreach ($supported_locales as $locale) {
            $rules['comment.' . $locale] = ['required', 'string', 'max:1000'];
        }

        return $rules;
    }
}
