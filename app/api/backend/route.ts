import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://cashcraft.runasp.net/api'

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
    
    const url = `${BACKEND_URL}/${path}`
    
    console.log(`[Backend Proxy] ${method} ${url}`)
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    let body = undefined
    if (method === 'POST' || method === 'PUT') {
      try {
        body = await request.text()
      } catch (e) {
        // No body
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    })

    const data = await response.text()
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    console.error('[Backend Proxy] Error:', error)
    return NextResponse.json(
      { 
        error: 'Backend connection failed', 
        message: error.message,
        backend: BACKEND_URL
      },
      { status: 500 }
    )
  }
}
