<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;

class AdminProfileService
{

    public function showProfile()
    {
        return Auth::guard('admin')->user()->load(['profile', 'profile.media']);
    }

    public function updateProfile(array $validatedData)
    {
        $admin = Auth::guard('admin')->user();

        return DB::transaction(function () use ($admin, $validatedData) {
            if (isset($validatedData['password'])) {
                $admin->update(['password' => Hash::make($validatedData['password'])]);
            }
            $profileData = Arr::only($validatedData, [
                'name'
            ]);
            $profile = $admin->profile()->updateOrCreate([], $profileData);

            if (isset($validatedData['profile_image']) && $validatedData['profile_image'] instanceof UploadedFile) {
                update_media($profile, $validatedData['profile_image'], 'profile-images', true);
            }

            return $admin->load(['profile.media']);
        });
    }
}
