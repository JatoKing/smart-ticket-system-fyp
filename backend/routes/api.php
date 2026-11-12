<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public, read-only fixture list for the Next.js landing page.
Route::get('/fixtures', [\App\Http\Controllers\Api\FixtureController::class, 'index'])->name('api.fixtures');
Route::get('/lineup', [\App\Http\Controllers\Api\LineupController::class, 'index'])->name('api.lineup');
Route::get('/stadium', [\App\Http\Controllers\Api\StadiumController::class, 'index'])->name('api.stadium');
