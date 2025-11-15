<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class AiController extends Controller
{
    // Previsão simples: stock futuro = atual - CMD * dia
    public function forecast(Request $request, Product $product)
    {
        $days = (int)$request->query('days', 30);
        $cmdWindow = (int)$request->query('window', 14);

        $cmd = $this->calculateCmd($product, $cmdWindow);
        $data = array();
        $ruptureDate = null;
        for ($d=1; $d <= $days; $d++) {
            $pred = $product->current_stock - $cmd * $d;
            if ($pred < 0) $pred = 0;
            $date = date('Y-m-d', strtotime('+' . $d . ' days'));
            $data[] = array('date' => $date, 'predicted_stock' => (int)round($pred));
            if ($ruptureDate === null && $pred <= $product->min_stock) {
                $ruptureDate = $date;
            }
        }

        return response()->json(array(
            'product_id' => $product->id,
            'days' => $days,
            'cmd' => $cmd,
            'data' => $data,
            'rupture_date' => $ruptureDate,
        ));
    }

    public function recommendations(Request $request)
    {
        $period = (int)$request->query('period', 14);
        $window = (int)$request->query('window', 14);
        $products = Product::where('active',true)->get();
        $result = array();
        foreach ($products as $p) {
            $cmd = $this->calculateCmd($p, $window);
            $needed = (int)ceil(($cmd * $period + $p->min_stock) - $p->current_stock);
            if ($needed > 0) {
                $result[] = array(
                    'product_id' => $p->id,
                    'sku' => $p->sku,
                    'name' => $p->name,
                    'current_stock' => $p->current_stock,
                    'min_stock' => $p->min_stock,
                    'cmd' => $cmd,
                    'recommended_purchase_qty' => $needed,
                    'reason' => 'Stock abaixo do mínimo em breve',
                );
            }
        }
        return response()->json($result);
    }

    protected function calculateCmd(Product $product, $window)
    {
        $outs = $product->movements()
            ->where('type','OUT')
            ->where('occurred_at','>=', now()->subDays($window))
            ->sum('quantity');
        if ($window > 0) return $outs / $window; else return 0.0;
    }
}
