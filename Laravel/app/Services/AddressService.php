<?php

namespace App\Services;

use App\Models\Address;
use App\Models\City;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class AddressService
{
    public function list(array $filters = [], ?int $customerId = null): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? $filters['perPage'] ?? 15;

        return Address::with(['customer', 'city', 'country'])
            ->filter($filters)
            ->latest()
            ->paginate($perPage);
    }

    public function createAddress(array $data): Address
    {
        return DB::transaction(function () use ($data) {
            $customerId = auth('customer')->id();
            $data['customer_id'] = $customerId;

            if (!empty($data['city_id'])) {
                $city = City::find($data['city_id']);
                if ($city) {
                    $data['country_id'] = $city->country_id;
                }
            }
            $hasAddresses = Address::where('customer_id', $customerId)->exists();
            if (!$hasAddresses) {
                $data['is_default'] = true;
            }
            if (!empty($data['is_default']) && $data['is_default']) {
                $this->resetDefaultAddress($customerId);
            }

            $address = Address::create($data);

            return $address->load(['country', 'city']);
        });
    }

    public function updateAddress(array $data, Address $address): Address
    {
        return DB::transaction(function () use ($data, $address) {
            if (!empty($data['city_id']) && $data['city_id'] != $address->city_id) {
                $city = City::find($data['city_id']);
                if ($city) {
                    $data['country_id'] = $city->country_id;
                }
            }

            if (!empty($data['is_default']) && $data['is_default']) {
                $this->resetDefaultAddress($address->customer_id, $address->id);
            }

            $address->update($data);
            return $address->fresh(['country', 'city']);
        });
    }

    public function deleteAddress(Address $address)
    {
        return $address->delete();
    }

    protected function resetDefaultAddress($customerId, $exceptAddressId = null)
    {
        $query = Address::where('customer_id', $customerId)->where('is_default', true);

        if ($exceptAddressId) {
            $query->where('id', '!=', $exceptAddressId);
        }

        $query->update(['is_default' => false]);
    }
}
