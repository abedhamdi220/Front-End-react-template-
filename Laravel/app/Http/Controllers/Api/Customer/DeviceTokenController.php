<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DeviceTokenController extends Controller
{

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'device_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => __('messages.validation_error'),
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::guard('customer')->user();

            if (!$user) {
                return response()->json(['status' => false, 'message' => __('messages.unauthorized')], 401);
            }

            $user->addDeviceToken($request->device_token);
            return api_success();
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }

    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'device_token' => 'required|string|exisit:device_tokens,token',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => __('messages.device_token_required_remove'),
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::guard('customer')->user();

        if ($user) {
            $user->removeDeviceToken($request->device_token);
        }
        return response()->json(['status' => true, 'message' => __('messages.token_removed')]);
    }
}
