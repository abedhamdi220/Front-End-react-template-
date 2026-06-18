<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UltraMsgService
{
    protected string $instanceId;
    protected string $token;
    protected string $baseUrl = 'https://api.ultramsg.com';

    public function __construct()
    {
        $this->instanceId = config('services.ultramsg.instance_id', '');
        $this->token = config('services.ultramsg.token', '');
    }

    public function sendWhatsAppMessage(string $to, string $body): bool
    {
        return $this->sendRequest('messages/chat', [
            'to' => $this->formatPhoneNumber($to),
            'body' => $body,
        ]);
    }

    public function sendDocument(string $to, string $fileUrl, string $filename, string $caption = ''): bool
    {
        return $this->sendRequest('messages/document', [
            'to' => $this->formatPhoneNumber($to),
            'document' => $fileUrl,
            'filename' => $filename,
            'caption' => $caption
        ]);
    }

    protected function sendRequest(string $endpoint, array $data): bool
    {
        if (empty($this->instanceId) || empty($this->token)) {
            Log::critical('UltraMsg configuration is missing.');
            return false;
        }

        $url = "{$this->baseUrl}/{$this->instanceId}/{$endpoint}";
        $data['token'] = $this->token;
        $data['priority'] = 10;

        try {
            $response = Http::post($url, $data);

            if ($response->successful()) {
                return true;
            } else {
                Log::error("UltraMsg API Error ({$endpoint}): " . $response->body());
                return false;
            }
        } catch (\Exception $e) {
            Log::error("UltraMsg Exception ({$endpoint}): " . $e->getMessage());
            return false;
        }
    }

    protected function formatPhoneNumber(string $phone): string
    {

        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        return $cleanPhone;
    }
}
