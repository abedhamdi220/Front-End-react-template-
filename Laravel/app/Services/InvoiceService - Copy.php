<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceService
{
    public function list(array $filters = [], $customerId = null)
    {
        $perPage = $filters['per_page'] ?? $filters['perPage'] ?? 10;

        return Invoice::with(['customer.profile', 'order'])
            ->when($customerId, function ($q) use ($customerId) {
                $q->where('customer_id', $customerId);
            })
            ->filter($filters)
            ->latest('issued_at')
            ->paginate($perPage);
    }

    public function findInvoice($id, $customerId = null)
    {
        $query = Invoice::with(['order.items.design', 'customer.profile']);

        if ($customerId) {
            $query->where('customer_id', $customerId);
        }

        return $query->findOrFail($id);
    }

    public function generatePdf(Order $order)
    {
        $order->loadMissing(['customer.profile', 'items.design', 'invoice']);

        $pdf = Pdf::loadView('admin.apps.invoices.pdf-template', ['order' => $order]);

        return $pdf;
    }

    public function validatePublicLink(Order $order, $hash)
    {
        return $hash === md5($order->created_at . $order->id);
    }
}
