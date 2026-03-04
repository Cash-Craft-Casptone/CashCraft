import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://cashcraft.runasp.net/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'DELETE')
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const path = pathSegments.join('/')
    const url = `${BACKEND_URL}/${path}`
    
    // Get headers from the original request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    // Get body for POST/PUT requests
    let body = undefined
    if (method === 'POST' || method === 'PUT') {
      try {
        body = await request.text()
      } catch (e) {
        // No body
      }
    }

    console.log(`Proxying ${method} request to: ${url}`)

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
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to backend', message: error.message },
      { status: 500 }
    )
  }
}
