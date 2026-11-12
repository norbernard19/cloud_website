<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;

class AIService
{
    public function generateResponse(string $message): string
    {
        $response = OpenAI::responses()->create([
            'model' => config('services.openai.model', 'gpt-5'),
            'input' => $message,
        ]);

        return $response->outputText;
    }
}