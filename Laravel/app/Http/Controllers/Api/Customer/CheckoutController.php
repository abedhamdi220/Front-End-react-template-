<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class CheckoutController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
    }
    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');

        if (!$sessionId) {
            return redirect()->route('home')->with('error', __('messages.session_id_missing'));
        }

        try {
            $session = Session::retrieve($sessionId);
            $orderId = $session->metadata->order_id ?? null;

            if (!$orderId) {
                throw new \Exception(__('messages.cannot_find_order_id'));
            }

            $order = Order::findOrFail($orderId);

            if ($session->payment_status === 'paid') {
                if ($order->payment_status !== 'paid') {
                    $order->update([
                        'payment_status' => 'paid',
                        'status'         => 'processing',
                        'transaction_id' => $session->payment_intent,
                        'session_id'     => $sessionId
                    ]);
                }
                return view('checkout.success', [
                    'catName' => 'app',
                    'title' => __('messages.order_success'),
                    "breadcrumbs" => [__('messages.shop'), __('messages.checkout')],
                    'order' => $order->id,
                    'scrollspy' => 0,
                    'simplePage' => 0
                ]);
            }
            return redirect()->route('home')->with('warning', __('messages.payment_error'));
        } catch (\Exception $e) {
            Log::error('Stripe Payment Error: ' . $e->getMessage());
            return redirect()->route('checkout.cancel')->with('error', __('messages.payment_process_error'));
        }
    }
    public function cancel()
    {
        return view('checkout.cancel')->with('error', __('messages.payment_canceled'));
    }
}