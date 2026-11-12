<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Read-only seating plan for the Next.js seat map (GET /api/stadium).
 * Source: config/stadium.php (mirrors the booking page's gate/section data).
 */
class StadiumController extends Controller
{
    public function index(): JsonResponse
    {
        $config = config('stadium');

        $sections = [];
        foreach ($config['gates'] as $gate => $categories) {
            foreach ($categories as $category => $levels) {
                foreach ($levels as $level => $ids) {
                    foreach ($ids as $id) {
                        $sections[] = [
                            'id' => $id,
                            'gate' => $gate,
                            'level' => (int) $level,
                            'category' => $category,
                        ];
                    }
                }
            }
        }

        $categories = collect($config['prices'])
            ->map(fn ($price, $key) => [
                'key' => $key,
                'label' => $config['labels'][$key] ?? $key,
                'price' => $price,
            ])
            ->values();

        return response()->json([
            'venue' => 'Stadium Bukit Jalil',
            'currency' => $config['currency'],
            'categories' => $categories,
            'gates' => array_keys($config['gates']),
            'sections' => $sections,
            'bookingPath' => route('customer.index', [], false),
        ]);
    }
}
