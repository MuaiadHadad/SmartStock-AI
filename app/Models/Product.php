<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name','sku','barcode','category','unit','cost_price','sale_price','min_stock','supplier_id','image_path','active','current_stock'
    ];

    protected $casts = [
        'active' => 'boolean',
        'cost_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function movements()
    {
        return $this->hasMany(StockMovement::class);
    }

    // Filtros simples
    public function scopeSearch($query, $term = null)
    {
        if ($term) {
            $like = "%$term%";
            $query->where(function($q) use ($like) {
                $q->where('name','like',$like)->orWhere('sku','like',$like)->orWhere('category','like',$like);
            });
        }
    }

    public function scopeFilterCategory($query, $category = null)
    {
        if ($category) $query->where('category',$category);
    }

    public function scopeFilterSupplier($query, $supplier = null)
    {
        if ($supplier) $query->where('supplier_id',$supplier);
    }

    public function scopeActive($query, $active = null)
    {
        if (!is_null($active)) $query->where('active', (bool)$active);
    }

    public function isBelowMin()
    {
        return $this->current_stock <= $this->min_stock;
    }
}
