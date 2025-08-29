import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL // e.g. https://your-flask-app.up.railway.app

function joinURL(base: string, path: string) {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: "Missing BACKEND_URL env" }, { status: 500 })
  }
  const search = req.nextUrl.search || ""
  const url = joinURL(BACKEND_URL, params.path.join("/")) + search
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } })
  const data = await res.text()
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  })
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: "Missing BACKEND_URL env" }, { status: 500 })
  }
  const url = joinURL(BACKEND_URL, params.path.join("/"))
  const body = await req.text()
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": req.headers.get("content-type") || "application/json", Accept: "application/json" },
    body,
  })
  const data = await res.text()
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  })
}

export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: "Missing BACKEND_URL env" }, { status: 500 })
  }
  const url = joinURL(BACKEND_URL, params.path.join("/"))
  const body = await req.text()
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": req.headers.get("content-type") || "application/json", Accept: "application/json" },
    body,
  })
  const data = await res.text()
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  })
}
