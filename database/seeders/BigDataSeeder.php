<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BigDataSeeder extends Seeder
{
    public function run()
    {
        // Config via env (fallback defaults)
        $suppliersCount = (int) env('BIG_SEED_SUPPLIERS', 200);
        $productsCount = (int) env('BIG_SEED_PRODUCTS', 5000);
        $movementsPerProduct = (int) env('BIG_SEED_MOVEMENTS_PER_PRODUCT', 10);
        $insertChunk = (int) env('BIG_SEED_CHUNK', 1000);

        $now = now();

        // Ensure at least one user exists for attributing movements
        $userId = User::query()->value('id');
        if (!$userId) {
            $user = User::query()->create([
                'name' => 'Seeder Admin',
                'email' => 'seeder-admin@local.test',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
            ]);
            $userId = $user->id;
        }

        // 1) Suppliers
        if (Supplier::query()->count() < $suppliersCount) {
            $toCreate = $suppliersCount - Supplier::query()->count();
            $batch = [];
            for ($i = 1; $i <= $toCreate; $i++) {
                $batch[] = [
                    'name' => 'Supplier '.str_pad((string)($i), 4, '0', STR_PAD_LEFT),
                    'email' => 'supplier'.str_pad((string)($i), 4, '0', STR_PAD_LEFT).'@example.com',
                    'phone' => '+3519'.mt_rand(10000000, 99999999),
                    'notes' => fake()->optional()->sentence(),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                if (count($batch) >= min($insertChunk, 1000)) {
                    Supplier::insert($batch);
                    $batch = [];
                }
            }
            if ($batch) Supplier::insert($batch);
        }
        $supplierIds = Supplier::query()->pluck('id')->all();

        // 2) Products
        if (Product::query()->count() < $productsCount) {
            $toCreate = $productsCount - Product::query()->count();
            $categories = ['Bebidas','Mercearia','Higiene','Frescos','Congelados','Laticínios','Padaria','Limpeza','Eletrónicos'];
            $units = ['un','kg','lt','cx','pc'];

            $batch = [];
            $existing = Product::query()->count();
            for ($i = 1; $i <= $toCreate; $i++) {
                $seq = $existing + $i;
                $category = $categories[array_rand($categories)];
                $name = $category.' '.Str::title(implode(' ', fake()->words(2)));
                $cost = mt_rand(50, 3000) / 10; // 5.0 - 300.0
                $markupPct = mt_rand(10, 80) / 100; // 0.10 - 0.80
                $price = round($cost * (1 + $markupPct), 2);
                $supplierId = $supplierIds ? $supplierIds[array_rand($supplierIds)] : null;
                $batch[] = [
                    'name' => $name,
                    'sku' => 'SKU-'.str_pad((string)$seq, 8, '0', STR_PAD_LEFT),
                    'barcode' => (string) mt_rand(100000000000, 999999999999),
                    'category' => $category,
                    'unit' => $units[array_rand($units)],
                    'cost_price' => $cost,
                    'sale_price' => $price,
                    'min_stock' => mt_rand(0, 50),
                    'supplier_id' => $supplierId,
                    'image_path' => null,
                    'active' => (bool) mt_rand(0, 1),
                    'current_stock' => 0, // will be recalculated based on movements
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                if (count($batch) >= $insertChunk) {
                    Product::insert($batch);
                    $batch = [];
                }
            }
            if ($batch) Product::insert($batch);
        }

        $productIds = Product::query()->orderBy('id')->pluck('id')->all();

        // 3) Stock Movements (bulk insert in chunks for speed)
        if ($movementsPerProduct > 0) {
            $reasons = ['Compra','Ajuste','Devolução','Venda','Perda','Transferência'];
            $movementsBatch = [];
            $batchSize = max(2000, $insertChunk);

            foreach (array_chunk($productIds, 500) as $productChunk) {
                foreach ($productChunk as $pid) {
                    // create a base IN movement to seed some stock
                    $baseQty = mt_rand(0, 200);
                    $occurredBase = now()->copy()->subDays(mt_rand(300, 720))->subMinutes(mt_rand(0, 1440));
                    $movementsBatch[] = [
                        'product_id' => $pid,
                        'user_id' => $userId,
                        'type' => 'IN',
                        'quantity' => $baseQty,
                        'reason' => 'Compra',
                        'occurred_at' => $occurredBase,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    // more movements across recent year
                    for ($m = 0; $m < $movementsPerProduct - 1; $m++) {
                        $type = (mt_rand(0, 100) < 60) ? 'OUT' : 'IN'; // more OUT to generate sales
                        $qty = mt_rand(1, 50);
                        $reason = $reasons[array_rand($reasons)];
                        $occurred = now()->copy()->subDays(mt_rand(0, 365))->subMinutes(mt_rand(0, 1440));
                        $movementsBatch[] = [
                            'product_id' => $pid,
                            'user_id' => $userId,
                            'type' => $type,
                            'quantity' => $qty,
                            'reason' => $reason,
                            'occurred_at' => $occurred,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    }

                    if (count($movementsBatch) >= $batchSize) {
                        DB::table('stock_movements')->insert($movementsBatch);
                        $movementsBatch = [];
                    }
                }
            }
            if ($movementsBatch) {
                DB::table('stock_movements')->insert($movementsBatch);
            }
        }

        // 4) Recalculate current_stock for all products based on movements
        DB::statement("UPDATE products SET current_stock = (SELECT COALESCE(SUM(CASE WHEN sm.type = 'IN' THEN sm.quantity ELSE -sm.quantity END), 0) FROM stock_movements sm WHERE sm.product_id = products.id)");
    }
}
