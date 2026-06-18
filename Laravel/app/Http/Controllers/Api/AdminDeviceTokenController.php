<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; 

class AdminDeviceTokenController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'device_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $admin = Auth::guard('admin')->user();

            if (!$admin) {
                $admin = Auth::user();
            }

            if (!$admin) {
                return response()->json([
                    'status' => false, 
                    'message' => 'Unauthorized: User not found or not logged in'
                ], 401);
            }
            if (!method_exists($admin, 'deviceTokens')) {
                Log::error("Relationship 'deviceTokens' method is missing in Admin model class: " . get_class($admin));
                return response()->json([
                    'status' => false, 
                    'message' => 'Server Error: deviceTokens relationship not defined on Admin model.'
                ], 500);
            }

            $admin->addDeviceToken($request->device_token);
            return response()->json([
                'status' => true,
                'message' => 'Device token stored successfully'
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error storing device token: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
            ], 500);
        }
    }
}