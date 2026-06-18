<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ProfileService
{
    public function showProfile()
    {
        return Auth::guard('customer')->user()->load([
            'profile',
            'profile.media',
            "addresses",
            "addresses.city",
            "addresses.country",
        ]);
    }

    public function updateProfile(array $attrs)
    {
        $customer = Auth::guard('customer')->user();

        return DB::transaction(function () use ($customer, $attrs) {
            if (!empty($attrs['password'])) {
                $attrs['password'] = Hash::make($attrs['password']);
            }
            $customer->update(Arr::only($attrs, ['phone', 'password']));
            $profileData = Arr::only($attrs, ['name', 'country_id', 'city_id']);
            $profile = $customer->profile()->updateOrCreate([], $profileData);

            if (array_key_exists('profile_image', $attrs)) {
                if ($attrs['profile_image']) {
                    update_media($profile, $attrs['profile_image'], 'profile-images', true);
                } elseif ($attrs['profile_image'] === null) {
                    delete_media($profile);
                }
            }
            return $customer->fresh([
                'profile',
                "addresses",
                "addresses.city",
                "addresses.country",
                'profile.media'
            ]);
        });
    }
}
