<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\UserController;

Route::post('/auth/login',[AuthController::class,'login']);
Route::post('/auth/register',[AuthController::class,'register']);

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/auth/me',[AuthController::class,'me']);
    Route::post('/auth/logout',[AuthController::class,'logout']);
    Route::post('/auth/change-password',[UserController::class,'changePassword']);

    Route::post('/users',[UserController::class,'store']);

    Route::get('/dashboard', [DashboardController::class,'summary']);
    Route::get('/products/stagnant',[DashboardController::class,'stagnant']);

    Route::apiResource('products', ProductController::class);
    Route::get('products/{product}/movements', function(App\Models\Product $product){
        $movements = $product->movements()->with('user')->orderByDesc('occurred_at')->paginate(50);
        return response()->json($movements);
    });

    Route::apiResource('suppliers', SupplierController::class);
    Route::get('stock-movements',[StockMovementController::class,'index']);
    Route::post('stock-movements',[StockMovementController::class,'store']);

    Route::get('ai/forecast/{product}', [AiController::class,'forecast']);
    Route::get('ai/recommendations', [AiController::class,'recommendations']);
});
