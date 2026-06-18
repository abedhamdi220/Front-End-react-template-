<?php

namespace App\Services;

use App\Events\ReviewCreated;
use App\Models\Customer;
use App\Models\Design;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReviewService
{
    use AuthorizesRequests;

    public function createReview($customer, array $data)
    {
        return DB::transaction(function () use ($data, $customer) {
            $reviewable = $this->findReviewableModel($data['type'], $data['id']);
            $orderNumber = $data['order_number'] ?? null;

            if (!$customer->can('review', [$reviewable, $orderNumber])) {
                throw ValidationException::withMessages(['message' => __('messages.You are not authorized to review this item.')]);
            }
            if ($this->hasReviewed($customer, $reviewable)) {
                throw ValidationException::withMessages(['message' => __('messages.You have already reviewed this item.')]);
            }

            $review = $reviewable->reviews()->create([
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
                'customer_id' => $customer->id,
            ]);
            ReviewCreated::dispatch($review);
            return $review;
        });
    }

    public function getReview($customer, $review)
    {
        if (!$customer->can('view', $review)) {
            throw ValidationException::withMessages(['message' => __('messages.You are not authorized to view this review.')]);
        }
        return $review->load(['reviewable', 'customer'])->findOrFail($review->id);
    }


    public function updateReview($customer, $review, array $data)
    {
        if (!$customer->can('update', $review)) {
            throw ValidationException::withMessages(['message' => __('messages.You are not authorized to update this review.')]);
        }
        return $review->update($data);
    }

    public function deleteReview($customer, $review)
    {
        if (!$customer->can('delete', $review)) {
            throw ValidationException::withMessages(['message' => __('messages.You are not authorized to delete this review.')]);
        }
        $review->delete();
        return true;
    }

    protected function findReviewableModel(string $type, int $id)
    {
        $modelClass = match ($type) {
            'order' => Order::class,
            'design' => Design::class,
            default => throw ValidationException::withMessages(['type' => __('messages.Invalid reviewable type.')]),
        };
        return $modelClass::findOrFail($id);
    }

    protected function hasReviewed(Customer $customer, Model $reviewable)
    {
        return Review::where('reviewable_type', get_class($reviewable))
            ->where('reviewable_id', $reviewable->id)
            ->where('customer_id', $customer->id)
            ->exists();
    }
}
