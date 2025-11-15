<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockMovementStoreRequest;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StockMovement::with(['product','user'])
            ->when($request->query('product'), function($q,$pid){ $q->where('product_id',$pid); })
            ->when($request->query('type'), function($q,$type){ $q->where('type',$type); })
            ->when($request->query('from'), function($q,$from){ $q->where('occurred_at','>=',$from); })
            ->when($request->query('to'), function($q,$to){ $q->where('occurred_at','<=',$to); })
            ->orderByDesc('occurred_at');
        return response()->json($query->paginate(50));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StockMovementStoreRequest $request)
    {
        $data = $request->validated();
        $product = Product::findOrFail($data['product_id']);

        if ($data['type'] === 'OUT' && $product->current_stock < $data['quantity']) {
            return response()->json(['error' => 'Stock insuficiente'], 422);
        }

        $movement = StockMovement::create([
            'product_id' => $product->id,
            'user_id' => $request->user()->id,
            'type' => $data['type'],
            'quantity' => $data['quantity'],
            'reason' => $data['reason'],
            'occurred_at' => isset($data['occurred_at']) ? $data['occurred_at'] : now(),
        ]);

        if ($movement->type === 'IN') {
            $product->current_stock += $movement->quantity;
        } else {
            $product->current_stock -= $movement->quantity;
        }
        $product->save();

        $movement->load('product');
        return response()->json([
            'movement' => $movement,
            'current_stock' => $product->current_stock
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
