<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class FirebaseNotificationService
{
    protected $messaging;

    public function __construct()
    {
        $credentialsPath = config('services.firebase.credentials');
        
        if (file_exists($credentialsPath)) {
            $factory = (new Factory())->withServiceAccount($credentialsPath);
            $this->messaging = $factory->createMessaging();
        } else {
            Log::error("Firebase credentials file not found at: $credentialsPath");
            $this->messaging = null;
        }
    }

    public function sendToToken($deviceToken, string $title, string $body, array $data = []): bool
    {
        if (!$this->messaging || empty($deviceToken)) {
            return false;
        }

        if (is_array($deviceToken)) {
            return $this->sendToTokens($deviceToken, $title, $body, $data);
        }

        try {
            $notification = Notification::create($title, $body);
            $message = CloudMessage::withTarget('token', $deviceToken)
                ->withNotification($notification)
                ->withData($data);
                
            $this->messaging->send($message);
            return true;
        } catch (\Throwable $e) {
            Log::error('Firebase Error: ' . $e->getMessage());
            return false;
        }
    }

    public function sendToTokens(array $deviceTokens, string $title, string $body, array $data = []): bool
    {
        if (!$this->messaging) {
            return false;
        }

        $validTokens = array_filter($deviceTokens);
        
        if (empty($validTokens)) {
            return false;
        }

        try {
            $notification = Notification::create($title, $body);
            
            $message = CloudMessage::new()
                ->withNotification($notification)
                ->withData($data);

            $report = $this->messaging->sendMulticast($message, $validTokens);

            if ($report->hasFailures()) {
                foreach ($report->failures() as $failure) {
                    Log::warning('Firebase Multicast Failure: ' . $failure->error()->getMessage());
                }
            }

            return $report->successes()->count() > 0;
        } catch (\Throwable $e) {
            Log::error('Firebase Multicast Error: ' . $e->getMessage());
            return false;
        }
    }
}