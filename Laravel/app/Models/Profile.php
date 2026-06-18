<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Profile extends Model
{
    use HasFactory, SoftDeletes, HasTranslations;

    public array $translatable = ['name'];

    protected $fillable = [
        'name',
        'is_active',
        'profileable_id',
        'profileable_type',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['avatar_url'];

    public function profileable(): MorphTo
    {
        return $this->morphTo();
    }

    public function media(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediable');
    }

    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->relationLoaded('media') && $this->media) {
                    return $this->media->file_url;
                }
                elseif ($this->media()->exists()) {
                    return $this->media->file_url;
                }
                $name = $this->attributes['name'] ?? 'User';
                if (is_string($name) && is_array(json_decode($name, true))) {
                     $name = json_decode($name, true)['en'] ?? 'User';
                }
                return "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=random";
            }
        );
    }
}
