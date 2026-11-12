<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::get('/ai', function () {
        return Inertia::render('AIChat');
    })->name('ai.index');

    Route::post('/ai/chat', [AIController::class, 'chat'])
        ->name('ai.chat');
});

Route::inertia('/', 'Welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
