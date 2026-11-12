<?php

namespace Database\Seeders;

use App\Models\Player;
use Illuminate\Database\Seeder;

/**
 * Malaysia national squad (name, role, age, club, market value).
 * Safe to run again: players are matched by name and updated.
 * Starting XI, captain and shirt numbers are chosen on the admin "Squad & Lineup" page.
 */
class PlayerSeeder extends Seeder
{
    /** Role → line on the pitch, and left-to-right order within that line. */
    private const ROLES = [
        'Goalkeeper' => ['GK', 1],
        'Left-Back' => ['DF', 1],
        'Centre-Back' => ['DF', 2],
        'Right-Back' => ['DF', 3],
        'Central Midfield' => ['MF', 1],
        'Defensive Midfield' => ['MF', 2], // holding midfielder sits in the middle
        'Attacking Midfield' => ['MF', 3],
        'Left Winger' => ['FW', 1],
        'Centre-Forward' => ['FW', 2],
        'Right Winger' => ['FW', 3],
    ];

    private const SQUAD = [
        ['Haziq Nadzli', 'Goalkeeper', 28, 'Kuching City', '€350.0K'],
        ['Suhaimi Husin', 'Goalkeeper', 32, 'Terengganu FC', '€150.0K'],
        ['Haziq Aiman', 'Goalkeeper', 21, 'Kuching City', '€75.0K'],
        ['Dominic Tan', 'Centre-Back', 29, 'Sabah FC', '€300.0K'],
        ['Rodney Celvin', 'Centre-Back', 29, 'Kuching City', '€275.0K'],
        ['Ubaidullah Shamsul', 'Centre-Back', 22, 'Terengganu FC', '€275.0K'],
        ['Safwan Mazlan', 'Centre-Back', 24, 'Terengganu FC', '€250.0K'],
        ['Daniel Ting', 'Left-Back', 34, 'Ratchaburi FC', '€150.0K'],
        ['Dion Cools', 'Right-Back', 30, 'Cerezo Osaka', '€700.0K'],
        ['Azam Azmi', 'Right-Back', 25, 'Terengganu FC', '€325.0K'],
        ['Quentin Cheng', 'Right-Back', 26, 'Selangor FC', '€325.0K'],
        ['Ariff Farhan', 'Right-Back', 30, 'Kuching City', '€200.0K'],
        ['Haziq Kutty', 'Defensive Midfield', 22, 'Terengganu FC', '€100.0K'],
        ['Ryan Lambert', 'Central Midfield', 28, 'Kuching City', '€275.0K'],
        ['Endrick', 'Attacking Midfield', 31, 'Star City FC', '€200.0K'],
        ['Ramadhan Saifullah', 'Left Winger', 25, 'Kuching City', '€300.0K'],
        ['Fergus Tierney', 'Left Winger', 23, 'Omonia 29th May', '€300.0K'],
        ['G. Pavithran', 'Left Winger', 21, 'Terengganu FC', '€25.0K'],
        ['Safawi Rasid', 'Right Winger', 29, 'Kuching City', '€350.0K'],
        ['Richard Chin', 'Right Winger', 24, 'Ross County FC', null],
        ['Romel Morales', 'Centre-Forward', 29, 'Terengganu FC', '€300.0K'],
        ['Paulo Josué', 'Centre-Forward', 37, 'Kuala Lumpur City FC', '€175.0K'],
        ['Syafiq Ahmad', 'Centre-Forward', 31, 'Kuala Lumpur City FC', null],
    ];

    public function run(): void
    {
        foreach (self::SQUAD as [$name, $role, $age, $club, $value]) {
            [$position, $order] = self::ROLES[$role];
            Player::updateOrCreate(['name' => $name], [
                'position' => $position,
                'role' => $role,
                'age' => $age,
                'club' => $club,
                'market_value' => $value,
                'sort_order' => $order,
            ]);
        }
    }
}
