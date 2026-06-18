<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Customer\OrderController;
use App\Http\Controllers\Api\Customer\DesignController;
use App\Http\Controllers\Api\Customer\ReviewController;
use App\Http\Controllers\Api\Customer\WalletController;
use App\Http\Controllers\Api\Customer\AddressController;
use App\Http\Controllers\Api\Customer\InvoiceController;
use App\Http\Controllers\Api\Customer\ProfileController;
use App\Http\Controllers\Api\Customer\DeviceTokenController;
use App\Http\Controllers\Api\Customer\NotificationController;

Route::prefix('v1')->group(function () {

    // Auth Routes 
    Route::prefix('auth')->middleware('throttle:auth_strict')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    // Public Downloads
    Route::get('public/invoices/{order}/download', [InvoiceController::class, 'download'])
        ->name('invoice.download.public')
        ->middleware(['signed', 'throttle:api']);
});

Route::prefix('v1')->middleware(['auth:customer', 'throttle:api'])->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
    });

    // Account
    Route::prefix('account')->group(function () {

        // Profile
        Route::get('profile',  [ProfileController::class, 'show'])->middleware('permission:profile.view');
        Route::put('profile',  [ProfileController::class, 'update'])->middleware('permission:profile.update');

        // Wallet
        Route::prefix('wallet')->group(function () {
            Route::get('balance',      [WalletController::class, 'balance'])->middleware('permission:wallet.view_balance');
            Route::get('transactions', [WalletController::class, 'transactions'])->middleware('permission:wallet.view_transactions');
        });

        // Addresses
        Route::apiResource('addresses', AddressController::class)
            ->middleware([
                'index'   => 'permission:addresses.view_own',
                'show'    => 'permission:addresses.view_own',
                'store'   => 'permission:addresses.create',
                'update'  => 'permission:addresses.update_own',
                'destroy' => 'permission:addresses.delete_own',
            ]);

        // Invoices
        Route::get('invoices/{id}/download', [InvoiceController::class, 'download'])
            ->middleware('permission:invoices.download_own');

        Route::apiResource('invoices', InvoiceController::class)
            ->only(['index', 'show'])
            ->middleware([
                'index' => 'permission:invoices.view_own',
                'show'  => 'permission:invoices.view_own',
            ]);

        // Notifications
        Route::prefix('notifications')->controller(NotificationController::class)->group(function () {

            Route::get('/', 'index')
                ->name('notifications.index')
                ->middleware('permission:notifications.view_own');

            Route::patch('/read-all', 'readAll')
                ->name('notifications.read-all')
                ->middleware('permission:notifications.manage_own');

            Route::prefix('{id}')->group(function () {
                Route::patch('/read', 'read')
                    ->name('notifications.read')
                    ->middleware('permission:notifications.manage_own');

                Route::delete('/', 'destroy')
                    ->name('notifications.destroy')
                    ->middleware('permission:notifications.manage_own');
            });
        });
    });

    // Shop
    Route::prefix('shop')->group(function () {

        // Designs
        Route::apiResource('designs', DesignController::class)
            ->middleware([
                'index'   => 'permission:designs.view',
                'show'    => 'permission:designs.view',
                'store'   => 'permission:designs.create',
                'update'  => 'permission:designs.update_own',
                'destroy' => 'permission:designs.delete_own',
            ]);

        // Orders
        Route::apiResource('orders', OrderController::class)
            ->only(['index', 'show', 'store', 'update', 'destroy'])
            ->middleware([
                'index'   => 'permission:orders.view_own',
                'show'    => 'permission:orders.track_own',
                'store'   => 'permission:orders.create',
                'update'  => 'permission:orders.reorder_own',
                'destroy' => 'permission:orders.cancel_own',
            ]);

        // Reviews
        Route::apiResource('reviews', ReviewController::class)
            ->only(['show', 'store', 'update', 'destroy'])
            ->middleware([
                'show'    => 'permission:reviews.view_own',
                'store'   => 'permission:reviews.create_own',
                'update'  => 'permission:reviews.update_own',
                'destroy' => 'permission:reviews.delete_own',
            ]);
    });

    // FCM Token
    Route::post('/fcm-token', [DeviceTokenController::class, 'store'])
        ->middleware('permission:notifications.manage_device_token');

    Route::delete('/fcm-token', [DeviceTokenController::class, 'destroy'])
        ->middleware('permission:notifications.manage_device_token');
});
