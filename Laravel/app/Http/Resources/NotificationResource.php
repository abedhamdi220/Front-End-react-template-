<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->data['title'] ?? 'Notification', 
            'message'     => $this->data['message'] ?? '',
            'type'        => class_basename($this->type),
            'is_read'     => !is_null($this->read_at),
            'read_at'     => $this->read_at?->toIso8601String(),
            'action_url'  => $this->data['action_url'] ?? null,
            'icon'        => $this->data['icon'] ?? null,
            'created_at'  => $this->created_at?->toIso8601String(),
            'human_time'  => $this->created_at?->diffForHumans(),
            'payload'     => $this->data,
        ];
    }
}
