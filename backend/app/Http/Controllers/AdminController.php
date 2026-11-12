<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\FootballMatch;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
         // Get counts
         $userCount = User::count();
         $matchCount = FootballMatch::count();

         // Get registration data for the last 12 months
         $registrationData = User::select(DB::raw('COUNT(*) as count'), DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'))
             ->where('created_at', '>=', Carbon::now()->subMonths(12))
             ->groupBy('month')
             ->orderBy('month')
             ->pluck('count', 'month')
             ->toArray();
        //   dd(json_encode($registrationData));
         // Prepare data for the chart
         $months = [];
         $data = [];

         // Fill in missing months with zero values
         for ($i = 11; $i >= 0; $i--) {
             $month = Carbon::now()->subMonths($i)->format('Y-m');
             $months[] = Carbon::now()->subMonths($i)->format('M Y');
             $data[] = $registrationData[$month] ?? 0;
         }

         return view('admin.dashboard', compact(
             'userCount',
             'matchCount',
             'months',
             'data'
         ));

    }
}
