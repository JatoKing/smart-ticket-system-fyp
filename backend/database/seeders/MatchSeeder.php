<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FootballMatch;

class MatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $match_seed = [
            [
                'teams' => 'Malaysia vs Indonesia',
                'date' => '2024-11-07',
                'time' => '20:35',
                'location' => 'Stadium Bukit Jalil',
            ],
            [
                'teams' => 'Malaysia vs Korea Republik',
                'date' => '2024-11-21',
                'time' => '20:35',
                'location' => 'Stadium Bukit Jalil',
            ],
        ];

        foreach($match_seed as $match) {
            FootballMatch::firstOrCreate($match);
        }
    }
}
