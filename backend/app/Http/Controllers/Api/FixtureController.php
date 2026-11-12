<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FootballMatch;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

/**
 * Read-only fixture list for the Next.js frontend (GET /api/fixtures).
 * Uses the existing footballmatches + tickets tables; nothing is written.
 */
class FixtureController extends Controller
{
    private const TIMEZONE = 'Asia/Kuala_Lumpur';

    public function index(): JsonResponse
    {
        $tickets = Ticket::query()
            ->selectRaw('match_id, MIN(price) as price_from, SUM(quantity) as remaining')
            ->groupBy('match_id')
            ->get()
            ->keyBy('match_id');

        $fixtures = FootballMatch::query()
            ->orderBy('date')
            ->orderBy('time')
            ->get()
            ->map(function (FootballMatch $match) use ($tickets) {
                // Stored as "Team A vs Team B"
                $teams = preg_split('/\s+(?:vs\.?|v)\s+/i', trim($match->teams), 2);
                $kickoff = $this->kickoff($match->date, $match->time);
                $ticket = $tickets->get($match->id);

                return [
                    'id' => $match->id,
                    'home' => $teams[0] ?? $match->teams,
                    'away' => $teams[1] ?? null,
                    'kickoff' => $kickoff?->toIso8601String(),
                    'date' => $match->date,
                    'time' => $match->time,
                    'venue' => $match->location,
                    'tickets' => [
                        'listed' => (bool) $ticket,
                        'priceFrom' => $ticket ? (float) $ticket->price_from : null,
                        'remaining' => $ticket ? (int) $ticket->remaining : null,
                        'currency' => 'MYR',
                    ],
                    'bookingPath' => route('customer.create', $match->id, false),
                ];
            })
            ->values();

        return response()->json([
            'timezone' => self::TIMEZONE,
            'fixtures' => $fixtures,
        ]);
    }

    private function kickoff(?string $date, ?string $time): ?Carbon
    {
        if (! $date) {
            return null;
        }

        try {
            return Carbon::parse(trim($date.' '.($time ?: '00:00')), self::TIMEZONE);
        } catch (\Throwable) {
            return null;
        }
    }
}
