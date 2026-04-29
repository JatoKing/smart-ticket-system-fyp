<?php

namespace App\Http\Controllers;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\TicketController;
use App\Models\Ticket;
use App\Models\FootballMatch;
use Illuminate\Http\Request;


class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($match)
{

    $tickets = Ticket::where('match_id', $match)->get();
    $match = FootballMatch::findOrFail($match); // Retrieve the match details

    return view('tickets.index', compact('tickets', 'match'));
}

    /**
     * Show the form for creating a new resource.
     */
    public function create($matchId)
    {
        $match = FootballMatch::findOrFail($matchId);
        return view('tickets.create', compact('match'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'match_id' => 'required|exists:footballmatches,id', // Ensure match_id is valid
            'price1' => 'required|numeric',
            'quantity1' => 'required|numeric',
            'type1' => 'required|string',
            'price2' => 'required|numeric',
            'quantity2' => 'required|numeric',
            'type2' => 'required|string',
            'price3' => 'required|numeric',
            'quantity3' => 'required|numeric',
            'type3' => 'required|string',
            'price4' => 'required|numeric',
            'quantity4' => 'required|numeric',
            'type4' => 'required|string',
            'price5' => 'required|numeric',
            'quantity5' => 'required|numeric',
            'type5' => 'required|string',
        ]);

        Ticket::create([
            'match_id' =>  $request->match_id,
    		'price'  =>  $request->price1,
            'quantity'  =>  $request->quantity1,
    		'type'  => $request->type1,
    	]);

        Ticket::create([
            'match_id' =>  $request->match_id,
    		'price'  =>  $request->price2,
            'quantity'  =>  $request->quantity2,
    		'type'  => $request->type2,
    	]);

        Ticket::create([
            'match_id' =>  $request->match_id,
    		'price'  =>  $request->price3,
            'quantity'  =>  $request->quantity3,
    		'type'  => $request->type3,
    	]);

        Ticket::create([
            'match_id' =>  $request->match_id,
    		'price'  =>  $request->price4,
            'quantity'  =>  $request->quantity4,
    		'type'  => $request->type4,
    	]);

        Ticket::create([
            'match_id' =>  $request->match_id,
    		'price'  =>  $request->price5,
            'quantity'  =>  $request->quantity5,
    		'type'  => $request->type5,
    	]);

        return redirect()->route('tickets.index', ['match' => $request->match_id])
        ->with('success', 'Ticket and Price created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FootballMatch $match)
    {
        $tickets = Ticket::where('match_id', $match->id)->get(); // Retrieve the associated match
        return view('tickets.show', compact('tickets', 'match')); // Corrected 'tickets' to 'ticket'
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }
}
