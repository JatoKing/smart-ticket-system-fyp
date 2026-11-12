<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
| php artisan lineup:random
| Picks a random 4-3-3 starting XI from the squad, respecting each player's role:
| GK; LB, 2 CB, RB; CM, DM, AM; LW, CF, RW. Everyone else goes to the bench.
| The captain and shirt numbers are left as they are (set them on the admin Squad page).
*/
Artisan::command('lineup:random', function () {
    // role => [how many start, left-to-right order within the line]
    $slots = [
        'Goalkeeper' => [1, 1],
        'Left-Back' => [1, 1], 'Centre-Back' => [2, 2], 'Right-Back' => [1, 3],
        'Central Midfield' => [1, 1], 'Defensive Midfield' => [1, 2], 'Attacking Midfield' => [1, 3],
        'Left Winger' => [1, 1], 'Centre-Forward' => [1, 2], 'Right Winger' => [1, 3],
    ];

    $picked = collect();
    foreach ($slots as $role => [$count, $order]) {
        $pool = \App\Models\Player::where('role', $role)->get();
        if ($pool->count() < $count) {
            $this->error("Not enough players with the role \"{$role}\" (need {$count}, found {$pool->count()}).");

            return 1;
        }
        $pool->random($count)->each(fn ($p) => $picked->push([$p, $role, $order]));
    }

    \Illuminate\Support\Facades\DB::transaction(function () use ($picked, $slots) {
        \App\Models\Player::query()->update(['is_starter' => false]);
        foreach ($slots as $role => [, $order]) {
            \App\Models\Player::where('role', $role)->update(['sort_order' => $order]);
        }
        foreach ($picked as [$player]) {
            $player->update(['is_starter' => true]);
        }
    });

    $this->info('Starting XI (4-3-3):');
    foreach ($picked as [$player, $role]) {
        $this->line("  {$role}: {$player->name}");
    }

    return 0;
})->purpose('Pick a random 4-3-3 starting XI by position');
