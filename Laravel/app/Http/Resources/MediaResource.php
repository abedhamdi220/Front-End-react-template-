<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'file_name' => $this->file_name,
            'url' => $this->file_url,
            'mime_type' => $this->mime_type,
            'file_type' => $this->file_type,
            'size' => $this->file_size,
        ];
    }
}
