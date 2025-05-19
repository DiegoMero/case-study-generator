import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { resumeUrl, ...rest } = body
    if (!resumeUrl) {
      return NextResponse.json({ error: 'Missing resumeUrl' }, { status: 400 })
    }
    // Forward the POST request to the resumeUrl
    const externalRes = await fetch(resumeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest),
    })
    const data = await externalRes.json().catch(() => ({}))
    return NextResponse.json({ ok: externalRes.ok, status: externalRes.status, data })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to forward request', details: String(err) }, { status: 500 })
  }
} 