'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const Input = ({
  name,
  placeholder,
  value,
  onChange,
  required = true,
}: {
  name: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}) => {
  return (
    <input
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      required={required}
    />
  )
}

const Textarea = ({
  name,
  placeholder,
  value,
  onChange,
  required = true,
}: {
  name: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
}) => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      rows={4}
      required={required}
    />
  )
}

interface WebhookResponse {
  success: boolean;
  message: string;
  content?: string;
  timestamp?: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    industry: '',
    challenge: '',
    vaType: '',
    vaName: '',
    clientRole: '',
    tasks: '',
    results: '',
    testimonial: '',
    duration: '',
    tools: '',
  })

  const [status, setStatus] = useState<string | null>(null)
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null)
  const [editedContent, setEditedContent] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [showSendPrompt, setShowSendPrompt] = useState(false)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [sendStatus, setSendStatus] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setWebhookResponse(null)
    setSendStatus(null)

    try {
      const res = await fetch('https://elazambs.app.n8n.cloud/webhook/5e7cfacf-2e43-470a-a159-1911ce007b76', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const responseData = await res.json()
      
      // Log the full response data
      console.log(responseData)
      
      // Extract content from the response structure (fixed for actual response)
      const vaName = responseData[0]?.vaName || formData.vaName
      const caseStudyContent = responseData[0]?.content || 'No content received'
      const resumeURL = responseData[0]?.resumeUrl || null
      setResumeUrl(resumeURL)
      
      // Add VA's name at the top of the case study
      const formattedContent = `# ${vaName}'s Case Study\n\n${caseStudyContent}`
      
      setWebhookResponse({
        success: res.ok,
        message: res.ok ? 'Webhook processed successfully' : 'Webhook processing failed',
        content: formattedContent,
        timestamp: new Date().toISOString(),
      })
      setShowSendPrompt(true)

      if (res.ok) {
        setStatus('Form submitted successfully!')
        setFormData({
          clientName: '',
          companyName: '',
          industry: '',
          challenge: '',
          vaType: '',
          vaName: '',
          clientRole: '',
          tasks: '',
          results: '',
          testimonial: '',
          duration: '',
          tools: '',
        })
      } else {
        setStatus('Submission failed.')
      }
      setIsGenerating(false)
    } catch (err) {
      console.error('Error submitting form:', err)
      setStatus('Error submitting form.')
      setWebhookResponse({
        success: false,
        message: 'Error processing webhook',
        timestamp: new Date().toISOString(),
      })
      setIsGenerating(false)
    }
  }

  const handleContentEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value)
  }

  const toggleEdit = () => {
    if (isEditing) {
      // Save changes
      setWebhookResponse(prev => prev ? { ...prev, content: editedContent } : null)
    } else {
      // Start editing
      setEditedContent(webhookResponse?.content || '')
    }
    setIsEditing(!isEditing)
  }

  // Send Case Study POST handler
  const handleSendCaseStudy = async (send: boolean) => {
    setShowSendPrompt(false)
    if (resumeUrl) {
      if (send && webhookResponse) {
        // Send case study, vaName, and yes
        const res = await fetch('/api/send-case-study', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: webhookResponse.content,
            vaName: formData.vaName,
            send: 'yes',
            resumeUrl: resumeUrl,
          }),
        })
        if (res.ok) {
          setSendStatus('Case Study sent successfully!')
        } else {
          setSendStatus('Failed to send Case Study.')
        }
      } else {
        // Send just no
        await fetch('/api/send-case-study', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ send: 'no', resumeUrl: resumeUrl }),
        })
        setSendStatus('Case Study not sent')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Case Study Generator</h1>
          <p className="text-xl text-gray-600">Internal tool for generating case studies from client data</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <form onSubmit={handleSubmit} className="flex-1 h-fit bg-white rounded-2xl shadow-xl p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <Input name="clientName" placeholder="Enter client name" value={formData.clientName} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client's Role (Optional)</label>
                  <Input name="clientRole" placeholder="Enter client's role" value={formData.clientRole} onChange={handleChange} required={false} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <Input name="companyName" placeholder="Enter company name" value={formData.companyName} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <Input name="industry" placeholder="Enter industry" value={formData.industry} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type of VA Provided</label>
                  <Input name="vaType" placeholder="Enter VA type" value={formData.vaType} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">VA's Name</label>
                  <Input name="vaName" placeholder="Enter VA's name" value={formData.vaName} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration of Engagement</label>
                  <Input name="duration" placeholder="Enter duration" value={formData.duration} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Tools Used</label>
                  <Input name="tools" placeholder="List tools used" value={formData.tools} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Client&apos;s Main Challenge</label>
                <Input name="challenge" placeholder="Describe the main challenge" value={formData.challenge} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tasks the VA Handles</label>
                <Textarea name="tasks" placeholder="Describe the tasks handled by the VA" value={formData.tasks} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Results After Hiring VA</label>
                <Textarea name="results" placeholder="Describe the results achieved" value={formData.results} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Testimonial (Optional)</label>
                <Textarea 
                  name="testimonial" 
                  placeholder="Share client testimonial (optional)" 
                  value={formData.testimonial} 
                  onChange={handleChange}
                  required={false}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] font-medium text-lg shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Case Study'}
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
            <div className="flex-1 bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Generated Case Study</h2>
                <div className="text-green-600 font-medium">
                  Done!
                </div>
              </div>
              {/* Send Case Study Prompt */}
              {showSendPrompt && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl flex items-center justify-between gap-4">
                  <span className="text-lg font-medium text-gray-800">Send Case Study?</span>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() => handleSendCaseStudy(true)}
                      disabled={isEditing}
                    >
                      Yes
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() => handleSendCaseStudy(false)}
                      disabled={isEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {/* Send status message */}
              {sendStatus && (
                <div className={`mb-6 p-4 rounded-xl text-center font-medium ${sendStatus.includes('success') ? 'bg-green-50 text-green-700' : sendStatus.includes('not sent') ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-700'}`}>
                  {sendStatus}
                </div>
              )}
              <div className="space-y-4">
                {webhookResponse.content && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-medium text-gray-500">You can edit the content below</p>
                      <button
                        onClick={toggleEdit}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                      >
                        {isEditing ? 'Save Changes' : 'Edit Content'}
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      {isEditing ? (
                        <textarea
                          value={editedContent}
                          onChange={handleContentEdit}
                          className="w-full h-[500px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <ReactMarkdown
                          components={{
                            strong: (props) => <strong className="font-bold text-gray-900" {...props} />,
                            p: (props) => <p className="mb-4 text-gray-900" {...props} />,
                            h1: (props) => <h1 className="text-3xl font-bold text-gray-900 mb-8" {...props} />,
                            ul: (props) => <ul className="list-disc pl-5 mb-4" {...props} />,
                            ol: (props) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                            li: (props) => <li className="mb-1" {...props} />,
                          }}
                        >
                          {webhookResponse.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 