<?php

namespace App\Services;

use App\Models\Design;
use App\Models\DesignOption;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class DesignOptionService
{
     public function list(array $filters = [])
    {
        $perPage = $filters['per_page'] ?? $filters['perPage'] ?? 12;

        return DesignOption::filter($filters)
            ->with('media')
            ->latest()
            ->paginate($perPage);
    }

    public function createDesignOption(array $data, ?UploadedFile $image = null): DesignOption
    {
        return DB::transaction(function () use ($data, $image) {
            $designOption = DesignOption::create($data);
            if ($image) {
                store_media($designOption, $image, 'design-options');
            }

            return $designOption;
        });
    }

    public function updateDesignOption(DesignOption $designOption, array $data, ?UploadedFile $image = null): DesignOption
    {
        return DB::transaction(function () use ($designOption, $data, $image) {
            $designOption->update($data);
            if ($image) {
                update_media($designOption, $image, 'design-options');
            }

            return $designOption;
        });
    }

    public function deleteDesignOption(DesignOption $designOption): void
    {
        DB::transaction(function () use ($designOption) {
            delete_media($designOption);
            $designOption->delete();
        });
    }

    public function syncForDesign(Design $design, array $optionsInput): void
    {
        if (empty($optionsInput)) {
            $design->options()->detach();
            return;
        }
        $ids = $this->prepareSyncData($optionsInput);

        $design->options()->sync($ids);
    }

    protected function prepareSyncData(array $optionsInput): array
    {
        $inputCollection = collect($optionsInput);

        if (!is_array($inputCollection->first())) {
            return DesignOption::whereIn('id', $inputCollection)->pluck('id')->toArray();
        }
        return DesignOption::whereIn('id', $inputCollection->pluck('id'))
            ->pluck('id')
            ->toArray();
    }
}
