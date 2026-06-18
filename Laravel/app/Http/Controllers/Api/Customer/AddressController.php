<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\FilterAddressRequest;
use App\Http\Requests\Address\StoreAddressRequest;
use App\Http\Requests\Address\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use App\Services\AddressService;
use App\Models\Address;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class AddressController extends Controller
{
    use AuthorizesRequests;
    public function __construct(protected AddressService $service) {}

    public function index(FilterAddressRequest $request)
    {
        $filters = $request->validated();
        $filters['customer_id'] = auth('customer')->id();


        $list = $this->service->list($filters);

        return api_paginate(AddressResource::collection($list));
    }

    public function store(StoreAddressRequest $request)
    {
        $data = $request->validated();
        $add = $this->service->createAddress($data);
        return api_success(new AddressResource($add), __('messages.address_created'), 201);
    }

    public function update(UpdateAddressRequest $request, Address $address)
    {
        $data = $request->validated();
        $updated_data = $this->service->updateAddress($data, $address);

        return api_success(new AddressResource($updated_data), __('messages.address_updated'));
    }

    public function show(Address $address)
    {
        $this->authorize('view', $address);
        return api_success(new AddressResource($address->load(['customer', 'country', 'city'])));
    }

    public function destroy(Address $address)
    {
        $this->authorize('delete', $address);
        $this->service->deleteAddress($address);
        return api_success(null, __('messages.address_deleted'));
    }
}
