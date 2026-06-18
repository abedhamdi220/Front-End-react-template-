<?php

namespace App\Services;

use App\Models\Design;
use Illuminate\Support\Facades\DB;

class DesignService
{
    public function __construct(protected DesignOptionService $service) {}

    public function getDesigns(array $filters)
    {
        $query = Design::with(['size', 'options', 'media', 'customer', 'reviews']);
        return $query->filter($filters)
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function createDesign(array $data, $customerId)
    {
        return DB::transaction(function () use ($data, $customerId) {
            $design = Design::create([
                'customer_id' => $customerId,
                'size_id' => $data['size_id'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'total_price' => $data['total_price'],
                'is_active' => true,
            ]);

            if (!empty($data['options'])) {
                $this->service->syncForDesign($design, $data['options']);
            }

            if (isset($data['images']) && !empty($data['images'])) {
                store_media($design, $data['images'], 'uploads/designs');
            }

            return $design->load(['options', 'media', 'size', 'customer', 'reviews']);
        });
    }

    public function updateDesign(array $data, Design $design)
    {
        return DB::transaction(function () use ($data, $design) {
            $design->update([
                'size_id' => $data['size_id'] ?? $design->size_id,
                'name' => $data['name'] ?? $design->name,
                'description' => $data['description'] ?? $design->description,
                'total_price' => $data['total_price'] ?? $design->total_price,
                'is_active' => $data['is_active'] ?? $design->is_active,
            ]);

            if (array_key_exists('options', $data)) {
                 $this->service->syncForDesign($design, $data['options'] ?? []);
            }
            if (array_key_exists('images', $data)) {
                update_media($design, $data['images'], 'uploads/designs', true);
            }

            return $design->refresh()->load(['options', 'media', 'size', 'customer', 'reviews']);
        });
    }

    public function deleteDesign(Design $design)
    {
        delete_media($design);
        $design->delete();
    }
}
