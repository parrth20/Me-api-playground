export type Project = { title: string; description?: string; links?: string[] }
export type Links = { github?: string; linkedin?: string; portfolio?: string }
export type Profile = {
  id: string
  name: string
  email: string
  headline?: string
  education?: any
  skills: string[]
  projects: Project[]
  links?: Links
  bio?: string
  created_at?: string
}

export async function apiGet<T>(path: string) {
  const res = await fetch(`/api/me/${path}`, { cache: "no-store" })
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return (await res.json()) as T
}

export async function apiPost<T>(path: string, body: any) {
  const res = await fetch(`/api/me/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `POST ${path} failed: ${res.status}`)
  }
  return (await res.json()) as T
}

export async function apiPatch<T>(path: string, body: any) {
  const res = await fetch(`/api/me/${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `PATCH ${path} failed: ${res.status}`)
  }
  return (await res.json()) as T
}
