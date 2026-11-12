<script setup>
import { ref } from 'vue'

const message = ref('')
const reply = ref('')
const loading = ref(false)

const sendMessage = async () => {
    if (!message.value.trim()) return

    loading.value = true
    reply.value = ''

    try {
        const response = await fetch('/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute('content'),
            },
            body: JSON.stringify({
                message: message.value,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Request failed')
        }

        reply.value = data.reply
    } catch (error) {
        reply.value = error.message
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-2xl font-bold mb-6">
            AI Assistant
        </h1>

        <textarea
            v-model="message"
            rows="4"
            placeholder="Ask AI anything..."
            class="w-full border rounded-lg p-3"
        />

        <button
            @click="sendMessage"
            :disabled="loading"
            class="mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
            {{ loading ? 'Thinking...' : 'Send Message' }}
        </button>

        <div
            v-if="reply"
            class="mt-6 p-4 border rounded-lg"
        >
            <h2 class="font-bold mb-2">AI Response</h2>
            <p class="whitespace-pre-wrap">{{ reply }}</p>
        </div>
    </div>
</template>