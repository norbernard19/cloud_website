<?php

namespace App\Http\Controllers;

use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function chat(Request $request, AIService $ai)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:4000'],
        ]);

        try {
            $reply = $ai->generateResponse(
                $validated['message']
            );

            return response()->json([
                'reply' => $reply,
            ]);

        } catch (\Throwable $e) {
            Log::error('AI request failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Unable to generate an AI response.',
            ], 503);
        }
    }
}