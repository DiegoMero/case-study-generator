'use client'

import { useState } from 'react'

interface WebhookResponse {
  success: boolean;
  message: string;
  content?: string;
  timestamp?: string;
}

export default function ClientStoryForm() {
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    industry: '',
    challenge: '',
    vaType: '',
    tasks: '',
    results: '',
    testimonial: '',
    duration: '',
    tools: '',
  })

  const [status, setStatus] = useState<string | null>(null)
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Sending...')
    setWebhookResponse(null)

    try {
      const res = await fetch('https://elazambs.app.n8n.cloud/webhook/5e7cfacf-2e43-470a-a159-1911ce007b76', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const responseData = await res.json()
      
      // Extract content from the response structure
      const content = responseData[0]?.message?.content || 'No content received'
      
      setWebhookResponse({
        success: res.ok,
        message: res.ok ? 'Webhook processed successfully' : 'Webhook processing failed',
        content: content,
        timestamp: new Date().toISOString(),
      })

      if (res.ok) {
        setStatus('Form submitted successfully!')
        setFormData({
          clientName: '',
          companyName: '',
          industry: '',
          challenge: '',
          vaType: '',
          tasks: '',
          results: '',
          testimonial: '',
          duration: '',
          tools: '',
        })
      } else {
        setStatus('Submission failed.')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setStatus('Error submitting form.')
      setWebhookResponse({
        success: false,
        message: 'Error processing webhook',
        timestamp: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Share Your Success Story</h1>
          <p className="text-xl text-gray-600">Help others understand the value of virtual assistance by sharing your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                <Input name="clientName" placeholder="Enter client name" value={formData.clientName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <Input name="companyName" placeholder="Enter company name (Optional)" value={formData.companyName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <Input name="industry" placeholder="Enter industry" value={formData.industry} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client's Main Challenge</label>
                <Input name="challenge" placeholder="Describe the main challenge" value={formData.challenge} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of VA Provided</label>
                <Input name="vaType" placeholder="Enter VA type" value={formData.vaType} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration of Engagement</label>
                <Input name="duration" placeholder="Enter duration" value={formData.duration} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Tools Used</label>
                <Input name="tools" placeholder="List tools used (Optional)" value={formData.tools} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tasks the VA Handles</label>
              <Textarea name="tasks" placeholder="Describe the tasks handled by the VA" value={formData.tasks} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Results After Hiring VA</label>
              <Textarea name="results" placeholder="Describe the results achieved" value={formData.results} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Testimonial</label>
              <Textarea name="testimonial" placeholder="Share your testimonial (Optional)" value={formData.testimonial} onChange={handleChange} />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] font-medium text-lg shadow-lg"
            >
              Submit Success Story
            </button>
          </div>

          {status && (
            <div className={`text-center p-4 rounded-xl ${
              status.includes('successfully') ? 'bg-green-50 text-green-700' : 
              status.includes('failed') ? 'bg-red-50 text-red-700' : 
              'bg-blue-50 text-blue-700'
            }`}>
              <p className="font-medium">{status}</p>
            </div>
          )}
        </form>

        {webhookResponse && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Webhook Response</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className={`mt-1 text-lg font-semibold ${
                    webhookResponse.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {webhookResponse.success ? 'Success' : 'Failed'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-500">Timestamp</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Date(webhookResponse.timestamp || '').toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-500">Message</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{webhookResponse.message}</p>
              </div>

              {webhookResponse.content && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 mb-2">Generated Content</p>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{webhookResponse.content}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Input({
  name,
  placeholder,
  value,
  onChange,
}: {
  name: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      required={placeholder.toLowerCase().includes('(optional') ? false : true}
    />
  )
}

function Textarea({
  name,
  placeholder,
  value,
  onChange,
}: {
  name: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      rows={4}
      required={placeholder.toLowerCase().includes('(optional') ? false : true}
    />
  )
}
