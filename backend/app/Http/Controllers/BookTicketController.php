<?php

namespace App\Http\Controllers;

use App\Models\BookTicket;
use App\Models\FootballMatch;
use Illuminate\Http\Request;

class BookTicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fmatches = FootballMatch::all();
        return view('customer.index',compact('fmatches'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(FootballMatch $fmatch)
    {
        // dd($match->id);
        // $matches = FootballMatch::find($matches->id);
        return view('customer.create', compact('fmatch'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, FootballMatch $fmatch)
    {
        // dump($request);
        // dump($match);
        // dd(1);

         // Validate the incoming request
        // $request->validate([
        //     'gate' => 'required|string',
        //     'type' => 'required|string',
        //     'level' => 'required|integer',
        //     'section' => 'required|string',
        //     'seat' => 'required|array|min:1', // Ensure at least one seat is selected
        //     'seat.*' => 'required|string', // Validate each selected seat
        //     'totalPrice' => 'required|numeric|min:0',
        //     'match_id' => 'required|exists:matches,id', // Ensure the match exists
        // ]);

        // dd(1);


    // Save each selected seat into the database
    foreach ($request->seat as $seat) {
        BookTicket::create([
            'match_id' => $request->match_id,
            'user_id' => auth()->user()->id,
            'gate' => $request->gate,
            'type' => $request->type,
            'level' => $request->level,
            'section' => $request->section,
            'seat' => $seat,
            'totalPrice' => $request->totalPrice,
        ]);
    }

    // Redirect back with a success message
    return redirect()->route('customer.show', ['fmatch' => $request->match_id])
        ->with('success', 'Tickets booked successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(FootballMatch $fmatch)
    {
        $bookTicket = BookTicket::where('match_id', $fmatch->id)->where('user_id', auth()->user()->id)->get(); // Retrieve the associated match
        return view('customer.show', compact('fmatch', 'bookTicket')); // Corrected 'tickets' to 'ticket'
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BookTicket $bookTicket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BookTicket $bookTicket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {

    $footballMatchId = $request->fmatch;
    // dd($request);

    // Delete all tickets associated with the match for the current user
    BookTicket::where('match_id', $footballMatchId)
        ->where('user_id', auth()->user()->id) // Ensure only the logged-in user's tickets are deleted
        ->delete();

    // Redirect back to the ticket selection page
    return redirect()->route('customer.create', ['fmatch' => $footballMatchId])
        ->with('success', 'All selected tickets have been deleted.');
    }
}
