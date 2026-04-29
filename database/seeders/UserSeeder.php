<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user_seed = [
            [
                'id' => '1',
                'name' => 'ADMIN',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('password'),
                'phone_number' => '0129432345',
                'address' => '1, LORONG ADMIN 1, TAMAN SRI ADMIN, 52300, SELANGOR, MALAYSIA',
                'role' => 'admin',
            ],
            [
                'id' => '2',
                'name' => 'Izzat',
                'email' => 'izzat@gmail.com',
                'password' => Hash::make('password'),
                'phone_number' => '0129432345',
                'address' => '1, LORONG IZZAT 1, TAMAN SRI IZZAT, 52300, SELANGOR, MALAYSIA',
                'role' => 'customer',
            ],
        ];

        foreach($user_seed as $user) {
            User::firstOrCreate($user);
        }
    }
}
