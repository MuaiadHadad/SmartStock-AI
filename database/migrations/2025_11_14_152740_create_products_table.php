<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('sku', 60)->unique();
            $table->string('barcode', 128)->nullable();
            $table->string('category', 100)->nullable();
            $table->string('unit', 20);
            $table->decimal('cost_price', 12, 2);
            $table->decimal('sale_price', 12, 2)->nullable();
            $table->integer('min_stock')->default(0);
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->string('image_path')->nullable();
            $table->boolean('active')->default(true);
            $table->integer('current_stock')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
