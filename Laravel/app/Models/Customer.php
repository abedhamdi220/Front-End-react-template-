<?php

namespace App\Models;

use App\Traits\HasDeviceTokens;
use App\Traits\HasProfileSearch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Customer extends Authenticatable
{
    use Notifiable, HasRoles, HasApiTokens, HasDeviceTokens, HasProfileSearch;

    protected $guard_name = 'customer';

    protected $fillable = ['phone', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'password' => 'hashed',
    ];

    public function profile(): MorphOne
    {
        return $this->morphOne(Profile::class, 'profileable');
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function scopeFilterCustomers(Builder $query, ?string $q = null): Builder
    {
        $query->with(['profile.media', 'permissions']);

        if ($q) {
            $query->search($q);
        }

        return $query->latest();
    }


    public function scopeFilter(Builder $query, array $filters)
    {


        $query->when($filters['search'] ?? null, function ($q, $search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('phone', 'like', "%{$search}%")
                    ->orWhereHas('profile', function ($q) use ($search) {
                        $locale = app()->getLocale();
                        $q->where("name->{$locale}", 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    });
            });
        });
        $query->when($filters['role'] ?? null, function ($q, $role) {
            $q->role($role);
        });

        $query->when($filters['permission'] ?? null, function ($q, $permission) {
            $q->permission($permission);
        });

        $query->when(
            isset($filters['min_balance']) || isset($filters['max_balance']),
            function ($q) use ($filters) {
                $q->whereHas('wallet', function ($w) use ($filters) {
                    $w->filter($filters);
                });
            }
        );

        return $query;
    }
}
