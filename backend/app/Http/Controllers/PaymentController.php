<?php

namespace App\Http\Controllers;

use App\Models\BookTicket;
use App\Models\FootballMatch;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($fmatch, $bookticket)
    {

        // Fetch ticket and match information
        $bookticket = BookTicket::find($bookticket);
        $fmatch = FootballMatch::find($fmatch);

        // Pass data to the view
        return view('payment.create', compact('bookticket', 'fmatch'));
    }

    public function store(Request $request)
{
    // dd($request);
    // Validate the form data
    $paymentData = $request->validate([
        'fullname' => 'required|string',
        'identification' => 'required|string',
        'ticket_id' => 'required|exists:bookticket,id',
    ]);

    // Store the payment details (adjust as needed)
    $payment = new Payment();
    $payment->fname = $paymentData['fullname'];
    $payment->identification = $paymentData['identification'];
    $payment->bookticket_id = $paymentData['ticket_id'];
    $payment->save();

    // Redirect to the success page
    return redirect()->route('payment.show', $payment)->with('success', 'Payment successful!');
}



    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        // dd($payment);
        $payment = Payment::with('bookTicket')->find($payment->id);
        return view('payment.show', compact('payment'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }
}
