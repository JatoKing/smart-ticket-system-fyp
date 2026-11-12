<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BookTicket;

class BookTicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bookticket_seed = [
            [
                'match_id' => '1',
                'gate' => 'C',
                'type' => 'Home',
                'level' => 'Level 2',
                'section' => '212',
                'seat' => '4C,5C,6C',
                'totalPrice' => '90',
            ],
        ];

        foreach($bookticket_seed as $bookticket) {
            BookTicket::firstOrCreate($bookticket);
        }
    }
}
