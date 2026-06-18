<?php

namespace App\Http\Controllers\Api\Customer;

use App\Events\ReviewCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Requests\Review\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Services\ReviewService;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;


class ReviewController extends Controller
{
    public function __construct(protected ReviewService $reviewService) {}

    public function store(StoreReviewRequest $request)
    {
        try {
            $review = $this->reviewService->createReview(Auth::guard('customer')->user(), $request->validated());
            event(new ReviewCreated($review));
            return api_success(new ReviewResource($review), __('messages.review_created'));
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }
    public function show(Review $review)
    {
        try {
            $review = $this->reviewService->getReview(Auth::guard('customer')->user(),$review);
            return api_success(new ReviewResource($review));
        } catch (\Exception $e) {
            return api_error(__('messages.review_not_found'), 404);
        }
    }
    public function update(UpdateReviewRequest $request,Review $review)
    {
        try {
            $review = $this->reviewService->updateReview(Auth::guard('customer')->user(),$review,$request->validated(),);
            return api_success(new ReviewResource($review), __('messages.review_updated'));
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }
    public function destroy(Review $review)
    {
        try {
            $review = $this->reviewService->deleteReview(Auth::guard('customer')->user(),$review);
            return api_success(null, __('messages.review_deleted'));
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }
}