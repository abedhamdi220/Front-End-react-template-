<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\FilterOrderRequest;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use App\Models\Order;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    use AuthorizesRequests;

    public function __construct(protected OrderService $orderService) {}

    public function index(FilterOrderRequest $request)
    {
        $filters = $request->validated();
        $filters['customer_id'] = Auth::guard('customer')->id();
        try {
            $orders = $this->orderService->list($filters);
            return api_paginate(OrderResource::collection($orders), __('messages.orders_retrieved'));
        } catch (\Exception $e) {
            return api_error($e->getMessage());
        }
    }

    public function store(StoreOrderRequest $request)
    {
        $customer = Auth::guard('customer')->user();
        try {
            $result = $this->orderService->handleOrderCreation($request->validated(), $customer);

            $order = $result['order'];
            $paymentInfo = $result['payment'] ?? [];

            $response = [
                'order' => new OrderResource($order),
                'payment_meta' => $paymentInfo
            ];

            return api_success($response, __('messages.order_created'), 201);

        } catch (\Exception $e) {
            return api_error($e->getMessage());
        }
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        try {
            $order->load(['items.design', 'items.size', 'items.selectedOptions']);
            return api_success(new OrderResource($order), __('messages.order_retrieved'));
        } catch (\Exception $e) {
            return api_error($e->getMessage());
        }
    }


    public function update(UpdateOrderRequest $request, Order $order)
    {
        $this->authorize('update', $order);

        try {
            $updatedOrder = $this->orderService->updateOrder($order, $request->validated());
            return api_success(new OrderResource($updatedOrder), __('messages.order_updated'), 201);
        } catch (\Exception $e) {
            return api_error($e->getMessage());
        }
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);
        try {
            $this->orderService->deleteOrder($order);
            return api_success(null, __('messages.order_deleted'));
        } catch (\Exception $e) {
            return api_error($e->getMessage());
        }
    }
}
