<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Design;
use App\Models\Item;
use App\Models\Order;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getAnalyticsData(): array
    {
        $totalCustomers = Customer::count();
        $lastWeekCustomers = Customer::where('created_at', '>=', now()->subDays(7))->count();

        $previousWeekCustomers = Customer::whereBetween('created_at', [now()->subDays(14), now()->subDays(7)])->count();
        $customerGrowth = $this->calculateGrowth($lastWeekCustomers, $previousWeekCustomers);

        $totalUserBalance = Wallet::sum('balance');
        $transactions = WalletTransaction::with(['wallet.customer.profile'])
            ->latest()
            ->take(6)
            ->get();

        $activeDesignsCount = Design::where('is_active', true)->count();
        $totalDesigns = Design::count();
        $activeDesignPercentage = $totalDesigns > 0 ? ($activeDesignsCount / $totalDesigns) * 100 : 0;

        $chartDates = [];
        $chartNewUsers = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $chartDates[] = now()->subDays($i)->format('d M');
            $chartNewUsers[] = Customer::whereDate('created_at', $date)->count();
        }

        return [
            'totalCustomers'     => $totalCustomers,
            'newCustomers'       => $lastWeekCustomers,
            'customerGrowth'     => $customerGrowth,
            'totalUserBalance'   => $totalUserBalance,
            'transactions'       => $transactions,
            'activeDesignsCount' => $activeDesignsCount,
            'activeDesignPercentage' => round($activeDesignPercentage, 1),
            'chartLabels'        => $chartDates,
            'chartSeries'        => $chartNewUsers,
        ];
    }

    public function getSalesData(): array
    {
        $validOrdersQuery = Order::where('status', '!=', 'cancelled');


        $totalRevenue = (clone $validOrdersQuery)->sum('grand_total');
        $totalShipping = (clone $validOrdersQuery)->sum('shipping_cost');
        $totalTax = (clone $validOrdersQuery)->sum('tax');
        $totalExpenses = $totalShipping + $totalTax;
        $netProfit = $totalRevenue - $totalExpenses;
        $totalOrders = Order::count();

        $recentOrders = Order::with(['customer.profile', 'items'])
            ->latest()
            ->take(6)
            ->get();

        $topDesigns = Item::select('design_id', DB::raw('sum(quantity) as total_sold'))
            ->with(['design' => function ($q) {
                $q->withTrashed()->with('media');
            }])
            ->groupBy('design_id')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        $revenueMonthly = [];
        $months = [];
        for ($m = 1; $m <= 12; $m++) {
            $months[] = Carbon::create()->month($m)->format('M');
            $revenueMonthly[] = Order::where('status', '!=', 'cancelled')
                ->whereYear('created_at', date('Y'))
                ->whereMonth('created_at', $m)
                ->sum('grand_total');
        }
        $dailySales = [];
        $dailySalesLabels = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dailySalesLabels[] = $date->format('D');
            $dailySales[] = Order::where('status', '!=', 'cancelled')
                ->whereDate('created_at', $date)
                ->sum('grand_total');
        }
        $ordersByStatus = Order::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        return [
            'totalRevenue'    => $totalRevenue,
            'totalOrders'     => $totalOrders,
            'recentOrders'    => $recentOrders,
            'topDesigns'      => $topDesigns,
            'netProfit'       => $netProfit,
            'totalShipping'   => $totalShipping,
            'totalTax'        => $totalTax,
            'totalExpenses'   => $totalExpenses,
            'revenueLabels'   => $months,
            'revenueData'     => $revenueMonthly,
            'dailySalesLabels'=> $dailySalesLabels,
            'dailySalesData'  => $dailySales,
            'ordersStatusData'=> array_values($ordersByStatus),
            'ordersStatusLabels'=> array_keys($ordersByStatus),
        ];
    }

    private function calculateGrowth($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        return round((($current - $previous) / $previous) * 100, 1);
    }
}
