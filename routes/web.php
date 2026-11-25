<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;
use App\Http\Controllers\PortfolioController;
use Inertia\Inertia;
Route::get('/garden/{flower}', fn (string $flower) => Inertia::render('garden/Show', ['slug' => $flower]))
    ->whereIn('flower', ['sampaguita', 'gumamela', 'waling-waling'])
    ->name('garden.show');
Route::inertia('/', 'garden/Home')->name('home');
Route::inertia('/flowers', 'garden/Flowers')->name('flowers');
Route::inertia('/garden/kalachuchi', 'garden/Kalachuchi')->name('garden.kalachuchi');

// keep the starter kit's existing auth/dashboard/settings routes below
// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
Route::get('/portfolio', PortfolioController::class)->name('portfolio');

Route::middleware(['auth'])->group(function () {
    Route::get('/ai', function () {
        return Inertia::render('AIChat');
    })->name('ai.index');

    Route::post('/ai/chat', [AIController::class, 'chat'])
        ->name('ai.chat');
});

// Route::inertia('/', 'Welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
