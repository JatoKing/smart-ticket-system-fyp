<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderHistoryController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('auth.login');
});

Auth::routes();

Route::middleware(['auth', 'check.role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // Other admin-specific routes
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::get('/matches', [MatchController::class, 'index'])->name('matches.index');
    Route::get('/matches/create', [MatchController::class, 'create'])->name('matches.create');
    Route::post('/matches', [MatchController::class, 'store'])->name('matches.store');
    Route::get('/matches/{match}', [MatchController::class, 'show'])->name('matches.show');
    Route::get('/matches/{match}/edit', [MatchController::class, 'edit'])->name('matches.edit');
    Route::put('/matches/{match}', [MatchController::class, 'update'])->name('matches.update');
    Route::delete('/matches/{match}', [MatchController::class, 'destroy'])->name('matches.destroy');

    Route::get('/matches/{match}/tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::get('/matches/{match}/tickets/create', [TicketController::class, 'create'])->name('tickets.create');
    Route::post('/matches/{match}/tickets', [TicketController::class, 'store'])->name('tickets.store');
    Route::get('/matches/{match}/tickets/show', [TicketController::class, 'show'])->name('tickets.show');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
});

Route::middleware(['auth', 'check.role:customer'])->group(function () {
    Route::get('/customer/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');
    // Other customer-specific routes
    Route::get('/customer/bookticket', [BookTicketController::class, 'index'])->name('customer.index');
    Route::get('/customer/bookticket/{fmatch}/order', [BookTicketController::class, 'create'])->name('customer.create');
    Route::post('/customer/bookticket/{fmatch}', [BookTicketController::class, 'store'])->name('customer.store');
    Route::get('/customer/bookticket/{fmatch}/details', [BookTicketController::class, 'show'])->name('customer.show');
    Route::delete('/customer/bookticket/{fmatch}', [BookTicketController::class, 'destroy'])->name('customer.destroy');
    Route::get('/customer/bookticket/{fmatch}/details/payment/{bookticket}', [PaymentController::class, 'create'])->name('payment.create');
    Route::post('/customer/bookticket/{fmatch}/details/payment', [PaymentController::class, 'store'])->name('payment.store');
    Route::get('/customer/viewpayment/{payment}', [PaymentController::class, 'show'])->name('payment.show');

});

Route::get('/order-history', [OrderHistoryController::class, 'index'])->name('order.history');






