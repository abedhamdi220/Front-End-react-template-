<?php

namespace App\Services;

use App\Models\Admin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class AdminService
{
    public function getAllAdmins(array $filters)
    {
        $perPage = $filters['per_page'] ?? $filters['perPage'] ?? 7;
        $perPage = max(1, min($perPage, 200));

        return Admin::with(['profile.media', 'roles', 'permissions'])
            ->filter($filters)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function createAdmin(array $data): Admin
    {
        return DB::transaction(function () use ($data) {
            $admin = Admin::create([
                'email'          => $data['email'],
                'password'       => Hash::make($data['password']),
                'is_super_admin' => false,
            ]);

            $admin->profile()->create([
                'name' => [
                    'en' => $data['name'],
                    'ar' => $data['name'],
                ],
                'is_active' => true,
            ]);
            return $admin;
        });
    }

    public function updateAdmin(Admin $admin, array $data): bool
    {
        return DB::transaction(function () use ($admin, $data) {
            $admin->email = $data['email'];

            if (!empty($data['password'])) {
                $admin->password = Hash::make($data['password']);
            }

            $admin->save();

            $admin->profile()->update([
                'name' => [
                    'en' => $data['name'],
                    'ar' => $data['name'],
                ]
            ]);

            return true;
        });
    }

    public function deleteAdmin(Admin $admin): bool
    {
        if ($admin->is_super_admin) {
            return false;
        }

        return DB::transaction(function () use ($admin) {
            $admin->profile()->delete();
            return $admin->delete();
        });
    }

    public function syncPermissions(Admin $admin, array $permissions): void
    {
        $admin->syncPermissions($permissions);
    }
}
