<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;

class OrderHistoryController extends Controller
{
    public function index()
    {
        $orders = Payment::where('user_id', Auth::id())
                        ->with('bookTicket.footballMatch')
                        ->orderBy('created_at', 'desc')
                        ->get();

        return view('order.history', compact('orders'));
    }
}
