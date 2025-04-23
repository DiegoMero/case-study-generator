'use client'

import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Sending...')

    try {
      const res = await fetch('https://elazambs.app.n8n.cloud/webhook-test/5e7cfacf-2e43-470a-a159-1911ce007b76', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (res.ok) {
        setStatus('Message sent successfully!')
        setMessage('')
      } else {
        setStatus('Failed to send message.')
      }
    } catch (error) {
      setStatus('Error sending message.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Send a Message</h1>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 border rounded-xl mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Send
        </button>
        {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
      </form>
    </div>
  );
}
