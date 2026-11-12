<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

/**
 * Admin: manage the national squad and choose the starting XI shown on the landing page.
 */
class PlayerController extends Controller
{
    public function index()
    {
        $players = Player::query()->inFormationOrder()->get();
        $starters = $players->where('is_starter', true);

        return view('players.index', [
            'players' => $players,
            'starterCount' => $starters->count(),
            'formation' => self::formation($starters),
        ]);
    }

    public function create()
    {
        return view('players.create', ['player' => new Player()]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $player = Player::create($data);
        $this->afterSave($player);

        return redirect()->route('players.index')->with('success', 'Player added.');
    }

    public function edit(Player $player)
    {
        return view('players.edit', compact('player'));
    }

    public function update(Request $request, Player $player)
    {
        $data = $this->validated($request, $player);
        $player->update($data);
        $this->afterSave($player);

        return redirect()->route('players.index')->with('success', 'Player updated.');
    }

    public function destroy(Player $player)
    {
        if ($player->photo_path) {
            Storage::disk('public')->delete($player->photo_path);
        }
        $player->delete();

        return redirect()->route('players.index')->with('success', 'Player removed.');
    }

    /** e.g. 4 defenders, 3 midfielders, 3 forwards → "4-3-3" (null until a full XI is picked). */
    public static function formation($starters): ?string
    {
        if ($starters->count() !== 11) {
            return null;
        }
        $lines = collect(['DF', 'MF', 'FW'])
            ->map(fn ($p) => $starters->where('position', $p)->count())
            ->filter();

        return $lines->isEmpty() ? null : $lines->implode('-');
    }

    private function validated(Request $request, ?Player $player = null): array
    {
        $validator = validator($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'shirt_number' => ['nullable', 'integer', 'between:1,99'],
            'position' => ['required', Rule::in(array_keys(Player::POSITIONS))],
            'role' => ['nullable', 'string', 'max:40'],
            'age' => ['nullable', 'integer', 'between:15,50'],
            'club' => ['nullable', 'string', 'max:100'],
            'market_value' => ['nullable', 'string', 'max:20'],
            'photo' => ['nullable', 'image', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'between:0,99'],
        ]);

        $validator->after(function (Validator $v) use ($request, $player) {
            if (! $request->boolean('is_starter')) {
                return;
            }
            $others = Player::where('is_starter', true)
                ->when($player, fn ($q) => $q->whereKeyNot($player->id));
            if ($others->count() >= 11) {
                $v->errors()->add('is_starter', 'The starting XI already has 11 players. Remove someone from the lineup first.');
            }
            if ($request->input('position') === 'GK' && (clone $others)->where('position', 'GK')->exists()) {
                $v->errors()->add('is_starter', 'Another goalkeeper is already in the starting XI.');
            }
        });

        $data = $validator->validate();
        $data['is_captain'] = $request->boolean('is_captain');
        $data['is_starter'] = $request->boolean('is_starter');
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        if ($request->hasFile('photo')) {
            if ($player?->photo_path) {
                Storage::disk('public')->delete($player->photo_path);
            }
            $data['photo_path'] = $request->file('photo')->store('players', 'public');
        }
        unset($data['photo']);

        return $data;
    }

    /** Only one captain at a time. */
    private function afterSave(Player $player): void
    {
        if ($player->is_captain) {
            Player::whereKeyNot($player->id)->where('is_captain', true)->update(['is_captain' => false]);
        }
    }
}
