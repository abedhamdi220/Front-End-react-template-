<?php

namespace App\Http\Controllers\Api\Customer;

use App\Events\DesignCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Design\FilterDesignRequest;
use App\Http\Requests\Design\StoreDesignRequest;
use App\Http\Requests\Design\UpdateDesignRequest;
use App\Http\Resources\DesignResource;
use App\Services\DesignService;
use App\Models\Design;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class DesignController extends Controller
{
    use AuthorizesRequests;
    public function __construct(protected DesignService $service) {}

    public function index(FilterDesignRequest $request)
    {
        $filters = $request->validated();
        try {
            $user = Auth::guard('customer')->user();
            $designs = $this->service->getDesigns($filters, $user);
            return api_paginate(DesignResource::collection($designs));
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }

    public function store(StoreDesignRequest $request)
    {
        $val = $request->validated();
        if ($request->hasFile('images')) {
            $val['images'] = $request->file('images');
        }

        $customerId = Auth::guard('customer')->id();
        try {
            $design = $this->service->createDesign($val, $customerId);

            event(new DesignCreated($design));

            return api_success(data: new DesignResource($design));
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }

    public function show(Design $design)
    {
        $design->load(['size', 'options', 'customer', 'media']);
        return api_success(new DesignResource($design));
    }

    public function update(UpdateDesignRequest $request, Design $design)
    {
        $this->authorize('update', $design);
        $val = $request->validated();

        if ($request->hasFile('images')) {
            $val['images'] = $request->file('images');
        } elseif (isset($val['images']) && is_null($val['images'])) {
            $val['images'] = null;
        } else {
            if (!array_key_exists('images', $val)) {
                unset($val['images']);
            }
        }

        try {
            $updateDesign = $this->service->updateDesign($val, $design);
            return api_success(new DesignResource($updateDesign));
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }

    public function destroy(Design $design)
    {
        $this->authorize('delete', $design);
        try {
            $this->service->deleteDesign($design);
            return api_success(null, __('messages.design_deleted'));
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }
}
