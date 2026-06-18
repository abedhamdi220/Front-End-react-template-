<?php

namespace App\Http\Controllers\Api\Customer;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Services\CustomerNotificationService;
use App\Http\Requests\FilterNotificationRequest;


class NotificationController extends Controller
{
    public function __construct(
        protected CustomerNotificationService $service
    ) {}

   public function index(FilterNotificationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $search = $validated['search'] ?? null;
        $filter = $validated['filter'] ?? 'all';
        $perPage = $validated['per_page'] ?? 10;

        $notifications = $this->service->list(
            $request->user(),
            $perPage,
            $search,
            $filter
        );

        return api_paginate(NotificationResource::collection($notifications));
    }

    public function read(string $id): JsonResponse
    {
        if (!\Illuminate\Support\Str::isUuid($id)) {
            return api_error('Invalid ID format', 400);
        }

        $notification = $this->service->markAsRead(auth()->user(), $id);

        if (!$notification) {
            return api_error('Notification not found or unauthorized', 404);
        }

        return api_success(
            new NotificationResource($notification),
            'Notification marked as read'
        );
    }

    public function readAll(): JsonResponse
    {
        $count = $this->service->markAllAsRead(auth()->user());

        return api_success(
            ['count' => $count],
            "{$count} notifications marked as read successfully"
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $deleted = $this->service->delete(auth()->user(), $id);

        if (!$deleted) {
            return api_error('Notification not found or could not be deleted', 404);
        }

        return api_success(null, 'Notification deleted successfully');
    }
}
