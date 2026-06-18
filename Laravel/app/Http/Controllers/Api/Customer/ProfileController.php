<?php

namespace App\Http\Controllers\Api\Customer;

use App\Services\ProfileService;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Http\Requests\Profile\UpdateCustomerProfileRequest;

class ProfileController extends Controller
{
    public function __construct(protected ProfileService $service) {}

    public function show()
    {
        $customer = $this->service->showProfile();
        return api_success(new ProfileResource($customer));
    }

    public function update(UpdateCustomerProfileRequest $request)
    {
        $attrs = $request->validated();
        if ($request->hasFile('profile_image')) {
            $attrs['profile_image'] = $request->file('profile_image');
        } elseif ($request->exists('profile_image') && is_null($request->input('profile_image'))) {
             $attrs['profile_image'] = null;
        }

        try {
            $updatedCustomer = $this->service->updateProfile($attrs);
            return api_success(new ProfileResource($updatedCustomer), __('messages.profile_updated'));
        } catch (\Exception $e) {
            Log::error($e);
            return api_error($e->getMessage(), 400);
        }
    }
}
