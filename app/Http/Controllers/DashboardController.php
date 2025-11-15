<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary()
    {
        // total valor inventário = soma(cost_price * current_stock)
        $totalStockValue = Product::where('active',true)
            ->selectRaw('COALESCE(SUM(cost_price * current_stock),0) as total')
            ->value('total');

        $belowMinCount = Product::whereColumn('current_stock','<=','min_stock')->count();

        $stagnantDays = (int)request()->query('stagnant_days', 30);
        $stagnantProducts = Product::whereDoesntHave('movements', function($q) use ($stagnantDays){
            $q->where('occurred_at','>=', now()->subDays($stagnantDays));
        })->get(['id','name','current_stock','cost_price']);
        $stagnantCount = $stagnantProducts->count();
        $stagnantValue = $stagnantProducts->sum(function($p){ return $p->cost_price * $p->current_stock; });

        $recentOut = StockMovement::where('type','OUT')
            ->where('occurred_at','>=', now()->subDays(7))
            ->selectRaw('date(occurred_at) as date, sum(quantity) as total_out')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'total_stock_value' => $totalStockValue,
            'below_min_count' => $belowMinCount,
            'stagnant_products_count' => $stagnantCount,
            'stagnant_products_value' => $stagnantValue,
            'recent_out_summary' => $recentOut,
        ]);
    }

    public function stagnant()
    {
        $days = (int)request()->query('days', 30);
        $products = Product::whereDoesntHave('movements', function($q) use ($days){
            $q->where('occurred_at','>=', now()->subDays($days));
        })->get()->map(function($p) use ($days){
            return [
                'product_id' => $p->id,
                'name' => $p->name,
                'days_without_movement' => $days,
                'current_stock' => $p->current_stock,
                'stock_value' => $p->current_stock * $p->cost_price,
            ];
        });
        return response()->json($products);
    }
}
