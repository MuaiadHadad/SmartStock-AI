<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && in_array($user->role, ['admin','manager']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:150',
            'sku' => 'required|string|max:60|unique:products,sku',
            'barcode' => 'nullable|string|max:128',
            'category' => 'nullable|string|max:100',
            'unit' => 'required|string|max:20',
            'cost_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'min_stock' => 'required|integer|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'image' => 'nullable|image|max:2048',
            'active' => 'nullable|boolean',
        ];
    }
}
