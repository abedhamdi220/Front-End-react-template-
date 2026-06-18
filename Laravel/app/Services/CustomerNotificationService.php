<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Notifications\DatabaseNotification;


class CustomerNotificationService
{

    public function list(Customer $customer,$perPage = 15, $search = null, $filter = 'all')
    {
        $query = $customer->notifications();
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('data->title', 'LIKE', "%{$search}%")
                    ->orWhere('data->message', 'LIKE', "%{$search}%")
                    ->orWhere('data->sender_name', 'LIKE', "%{$search}%");
            });
        }
        if ($filter === 'unread') {
            $query->whereNull('read_at');
        } elseif ($filter === 'read') {
            $query->whereNotNull('read_at');
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function markAsRead(Customer $customer, string $id): ?DatabaseNotification
    {
        $notification = $customer->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
            return $notification;
        }

        return null;
    }

    public function markAllAsRead(Customer $customer): int
    {
        return $customer->unreadNotifications()->update(['read_at' => now()]);
    }

    public function delete(Customer $customer, string $id): bool
    {
        $notification = $customer->notifications()->where('id', $id)->first();

        if ($notification) {
            return $notification->delete();
        }

        return false;
    }
}
