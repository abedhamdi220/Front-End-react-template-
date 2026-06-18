<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Enums\PaymentStatus;
use App\Enums\OrderStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sig_header,
                $endpoint_secret
            );
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe Webhook Signature Error: ' . $e->getMessage());
            return response()->json(['error' => __('messages.invalid_signature')], 400);
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => __('messages.invalid_payload')], 400);
        }

        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $this->handleCheckoutSessionCompleted($session);
                break;

            case 'payment_intent.payment_failed':
                Log::warning('Payment failed for session: ' . $event->data->object->id);
                break;

            default:
                Log::info('Received unknown event type ' . $event->type);
        }

        return response()->json(['status' => 'success']);
    }

    protected function handleCheckoutSessionCompleted($session)
    {
        $orderId = $session->metadata->order_id ?? null;

        if (!$orderId) {
            Log::error('Order ID not found in Stripe session metadata');
            return;
        }

        $order = Order::find($orderId);

        if (!$order) {
            Log::error("Order #{$orderId} not found during Webhook processing.");
            return;
        }

        if ($order->payment_status !== PaymentStatus::PAID->value ) {
            $order->update([
                'payment_status' => PaymentStatus::PAID->value,
                'status' => OrderStatus::PROCESSING->value,
                'transaction_id' => $session->payment_intent,
                'session_id' => $session->id
            ]);

            Log::info("Order #{$order->id} marked as paid via Webhook.");
        }
    }
}
