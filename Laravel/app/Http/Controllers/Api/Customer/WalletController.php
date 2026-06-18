<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Wallet\FilterWalletTransactionRequest;
use App\Http\Resources\WalletResource;
use App\Http\Resources\WalletTransactionResource;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;


class WalletController extends Controller
{
    public function __construct(protected WalletService $walletService) {}

    public function balance(): JsonResponse
    {
        $customer = Auth::guard('customer')->user();
        $wallet = $this->walletService->getWalletBalance($customer);
        return api_success(new WalletResource($wallet), __('messages.wallet_balance_retrieved'));
    }

    public function transactions(FilterWalletTransactionRequest $request)
    {
        $filters = $request->validated();
        $customer = Auth::guard('customer')->user();
        $transactions = $this->walletService->getTransactions($customer, $filters);

        return api_success(WalletTransactionResource::collection($transactions));
    }
}
