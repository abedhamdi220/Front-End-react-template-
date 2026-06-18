<?php

namespace App\Http\Controllers\Api\Customer;

use App\Models\Order;

use App\Models\Invoice;
use Illuminate\Http\Request;
use App\Services\InvoiceService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\InvoiceResource;
use App\Http\Requests\Invoice\FilterInvoiceRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class InvoiceController extends Controller
{
    use AuthorizesRequests;

    public function __construct(protected InvoiceService $invoiceService)
    {
    }

    public function index(FilterInvoiceRequest $request)
    {
        $this->authorize('viewAny', Invoice::class);

        $filters = $request->validated();
        $customer = Auth::guard('customer')->user();
        $perPage = $filters['per_page'] ?? 10;

        $invoices = $this->invoiceService->list(
            $filters,
            $customer->id
        );

        return api_paginate(InvoiceResource::collection($invoices));
    }

    public function show($id)
    {
        $customer = Auth::guard('customer')->user();
        $invoice = $this->invoiceService->findInvoice($id, $customer->id);
        $this->authorize('view', $invoice);

        return api_success(new InvoiceResource($invoice));
    }


    public function download(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);
        
        if (!$request->hasValidSignature()) {
            $customer = Auth::guard('customer')->user();
            if (!$customer || $order->customer_id !== $customer->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        $pdf = $this->invoiceService->generatePdf($order);
        $filename = 'invoice-' . ($order->invoice->invoice_number ?? $order->order_number) . '.pdf';

        return $pdf->download($filename);
    }
}
