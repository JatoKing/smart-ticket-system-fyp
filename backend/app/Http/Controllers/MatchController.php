<?php

namespace App\Http\Controllers;

use App\Models\FootballMatch;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $matches = FootballMatch::all();
        return view('matches.index',compact('matches'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('matches.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        FootballMatch::create([
            'teams' =>  $request->teams,
    		'date'  =>  $request->date,
    		'time'  => $request->time,
            'location' => $request->location,
    	]);

        return redirect()->route('matches.index')
        ->with('success','Match created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FootballMatch $match)
    {
        return view('matches.show',compact('match'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FootballMatch $match)
    {
        return view('matches.edit',compact('match'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FootballMatch $match)
    {
        $match->update($request->all());

        return redirect()->route('matches.index')
                        ->with('success','Match updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FootballMatch $match)
    {
        $match->delete();

        return redirect()->route('matches.index')
                        ->with('success','Match deleted successfully');
    }
}
