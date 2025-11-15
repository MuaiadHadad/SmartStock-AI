<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiFlowFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_create_product_and_stock_movement_flow(): void
    {
        $password = 'secret123';
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt($password),
            'role' => 'admin'
        ]);

        $login = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => $password,
        ])->assertStatus(200)->json();
        $token = $login['token'];

        $supplierResp = $this->withHeader('Authorization','Bearer '.$token)
            ->postJson('/api/suppliers', ['name' => 'Fornecedor Teste'])
            ->assertStatus(201)->json();

        $productResp = $this->withHeader('Authorization','Bearer '.$token)
            ->postJson('/api/products', [
                'name' => 'Produto A',
                'sku' => 'SKU-A',
                'unit' => 'un',
                'cost_price' => 10,
                'min_stock' => 5,
                'supplier_id' => $supplierResp['id']
            ])->assertStatus(201)->json();

        $moveResp = $this->withHeader('Authorization','Bearer '.$token)
            ->postJson('/api/stock-movements', [
                'product_id' => $productResp['id'],
                'type' => 'IN',
                'quantity' => 10,
                'reason' => 'compra'
            ])->assertStatus(201)->json();
        $this->assertEquals(10, $moveResp['current_stock']);

        $forecast = $this->withHeader('Authorization','Bearer '.$token)
            ->getJson('/api/ai/forecast/'.$productResp['id'].'?days=5')
            ->assertStatus(200)->json();
        $this->assertArrayHasKey('rupture_date', $forecast);
    }
}
