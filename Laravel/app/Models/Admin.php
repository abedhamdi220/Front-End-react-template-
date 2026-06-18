<?php

namespace App\Models;

use App\Traits\HasDeviceTokens;
use App\Traits\HasProfileSearch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Admin extends Authenticatable
{
    use Notifiable, HasRoles, HasApiTokens, HasDeviceTokens, HasProfileSearch;

    protected $guard = 'admin';

    protected $fillable = ['email', 'password', 'is_super_admin'];

    protected $hidden = ['password'];

    protected $casts = [
        'password' => 'hashed',
        'is_super_admin' => 'boolean',
    ];

    public function profile(): MorphOne
    {
        return $this->morphOne(Profile::class, 'profileable');
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        $query->where('is_super_admin', false)->with('profile.media');

        if ($q = data_get($filters, 'q')) {
            $query->search($q);
        }
        if ($role = data_get($filters, 'role')) {
            $query->role($role);
        }
        if ($permission = data_get($filters, 'permission')) {
            $query->permission($permission);
        }

        return $query;
    }
}
