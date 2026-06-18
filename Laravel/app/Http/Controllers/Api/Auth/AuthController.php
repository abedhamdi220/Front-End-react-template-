<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Access\Api\LoginRequest;
use App\Http\Requests\Access\Api\RegisterRequest;
use App\Http\Resources\ProfileResource;
use App\Services\AuthService;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(protected AuthService $Service) {}

    public function register(RegisterRequest $request)
    {
        $attr = $request->validated();
        if ($request->hasFile('profile_image')) {
            $attr['profile_image'] = $request->file('profile_image');
        }
        try {
            $customer = $this->Service->register($attr);
            return api_success(new ProfileResource($customer), 'User registered successfully', 201);
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }
    public function login(LoginRequest $request)
    {
        $attr = $request->validated();
        try {
            $customer = $this->Service->login($attr);
            return api_success(new ProfileResource($customer), 'User logged in successfully');
        } catch (ValidationException $ve) {
            return api_validation_error($ve->errors(), 'Invalid credentials');
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }
    public function logout()
    {
        try {
            $customer = auth()->guard('customer')->user();
            $loggedOut = $this->Service->logout($customer);
            if ($loggedOut) {
                return api_success(null, 'User logged out successfully');
            }
            return api_error('No active session found', 400);
        } catch (\Exception $e) {
            return api_error($e->getMessage(), 400);
        }
    }
}
