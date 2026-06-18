<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;

class NotificationService
{
    protected function getUser()
    {
        return Auth::guard('admin')->user();
    }

    public function getAdminNotifications($perPage = 15, $search = null, $filter = 'all')
    {
        $query = $this->getUser()->notifications();

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


    public function getUnreadNotifications($limit = 10)
    {
        return $this->getUser()
            ->unreadNotifications()
            ->latest()
            ->take($limit)
            ->get();
    }

    public function getUnreadCount()
    {
        return $this->getUser()->unreadNotifications()->count();
    }

    public function markAsRead($notificationId)
    {
        $updated = $this->getUser()
            ->notifications()
            ->where('id', $notificationId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $updated > 0;
    }

    public function markAllAsRead()
    {
        $this->getUser()->unreadNotifications()->update(['read_at' => now()]);
    }

    public function deleteNotification($notificationId)
    {
        return $this->getUser()
            ->notifications()
            ->where('id', $notificationId)
            ->delete();
    }
}
