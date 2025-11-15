<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $fillable = ['name','email','phone','notes'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
