import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://cashcraft.runasp.net/api'

export const runtime = 'nodejs' // Ensure Node.js runtime
export const dynamic = 'force-dynamic' // Disable caching

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST')
}

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET')
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE')
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    // Get the path from query parameter
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path') || ''
    
    if (!path) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      )
    }
    
    const url = `${BACKEND_URL}/${path}`
    
    console.log(`[Backend Proxy] ${method} ${url}`)
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    let body = undefined
    if (method === 'POST' || method === 'PUT') {
      try {
        body = await request.text()
        console.log(`[Backend Proxy] Body:`, body.substring(0, 200))
      } catch (e) {
        console.log(`[Backend Proxy] No body`)
      }
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      body,
    }

    console.log(`[Backend Proxy] Fetching...`)
    const response = await fetch(url, fetchOptions)
    console.log(`[Backend Proxy] Response status: ${response.status}`)

    const responseText = await response.text()
    console.log(`[Backend Proxy] Response:`, responseText.substring(0, 200))
    
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    console.error('[Backend Proxy] Error:', error)
    console.error('[Backend Proxy] Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: 'Backend connection failed', 
        message: error.message,
        stack: error.stack,
        backend: BACKEND_URL
      },
      { status: 500 }
    )
  }
}
