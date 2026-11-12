<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\PlayerController;
use App\Models\Player;
use Illuminate\Http\JsonResponse;

/**
 * Read-only current lineup for the Next.js frontend (GET /api/lineup).
 */
class LineupController extends Controller
{
    public function index(): JsonResponse
    {
        $players = Player::query()->inFormationOrder()->get();
        $starters = $players->where('is_starter', true)->values();

        $present = fn (Player $p) => [
            'id' => $p->id,
            'name' => $p->name,
            'number' => $p->shirt_number,
            'position' => $p->position,
            'positionLabel' => Player::POSITIONS[$p->position] ?? $p->position,
            'role' => $p->role,
            'age' => $p->age,
            'club' => $p->club,
            'marketValue' => $p->market_value,
            'photo' => $p->photoPath(),
            'captain' => $p->is_captain,
        ];

        return response()->json([
            'formation' => PlayerController::formation($starters),
            'starters' => $starters->map($present)->values(),
            'substitutes' => $players->where('is_starter', false)->map($present)->values(),
            'updatedAt' => optional($players->max('updated_at'))->toIso8601String(),
        ]);
    }
}
