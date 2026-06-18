<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $fillable = ['file_name', 'file_path', 'mime_type', 'file_type', 'file_size'];

    protected $appends = ['file_url'];

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }

    protected function fileUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->file_path ? Storage::url($this->file_path) : null
        );
    }

    public function getUrl(string $conversion = ''): ?string
    {
        if (!$this->file_path) {
            return null;
        }
        if ($conversion !== 'thumb') {
            return $this->file_url;
        }
        $pathInfo = pathinfo($this->file_path);
        $filename = $pathInfo['filename'] ?? null;
        $extension = $pathInfo['extension'] ?? '';
        $dirname = $pathInfo['dirname'] ?? '';

        if (!$filename) {
            return $this->file_url;
        }

        $thumbPath = ($dirname !== '.' ? $dirname . '/' : '') . $filename . '_thumb' . ($extension ? '.' . $extension : '');
        if (Storage::disk('public')->exists($thumbPath)) {
            return Storage::url($thumbPath);
        }
        return $this->file_url;
    }
}
