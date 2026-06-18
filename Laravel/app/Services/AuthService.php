<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Arr;
use App\Events\UserRegistered;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;


class AuthService
{
    public function register(array $attrs)
    {
        $attrs['password'] = Hash::make($attrs['password']);

        return DB::transaction(function () use ($attrs) {
            $customerData = Arr::only($attrs, ['phone', 'password']);
            $customer = Customer::create($customerData);
            $profile = $customer->profile()->create([
                'name' => $attrs['name'] ?? [],
                'is_active' => true,
            ]);

            if (!empty($attrs['profile_image'])) {
                store_media($profile, $attrs['profile_image'], 'profile-images', 'public');
            }
              $defaultRole = Role::where('name', 'customer')
                                ->where('guard_name', 'customer')
                                ->first();

            if ($defaultRole) {
                $customer->assignRole($defaultRole);
            }
            $customer->load(['profile', 'profile.media', 'roles']);

            $customer->access_token = $customer->createToken('API_Token')->accessToken;

            event(new UserRegistered($customer));

            return $customer;
        });
    }

    public function login($attrs)
    {
        $customer = Customer::where('phone', $attrs['phone'])->first();
        if (! $customer || ! Hash::check($attrs['password'], $customer->password)) {
            throw ValidationException::withMessages([
                'phone' => ['These credentials do not match our records.'],
            ]);
        }
        $customer->load('profile', 'profile.media');

        $customer->access_token = $customer->createToken('API_Token')->accessToken;
        return $customer->load(['profile','profile.media']);
    }

    public function logout($user): bool
    {
        if ($user) {
            $token = $user->token();
            if ($token) {
                $token->revoke();
                return true;
            }
        }
        return false;
    }
}
