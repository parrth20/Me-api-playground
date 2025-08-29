"use client"

import { useState } from "react"
import { apiPatch, apiPost } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const ADMIN_PASS_ENV = process.env.NEXT_PUBLIC_ADMIN_PASSCODE

export default function AdminEditor() {
  const [unlocked, setUnlocked] = useState(false)
  const [pass, setPass] = useState("")
  const [profileId, setProfileId] = useState("")
  const [payload, setPayload] = useState<any>({
    name: "",
    email: "",
    headline: "",
    skills: [],
    projects: [],
    links: {},
    bio: "",
  })

  if (!unlocked) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="Enter passcode" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          <Button onClick={() => setUnlocked(pass && ADMIN_PASS_ENV && pass === ADMIN_PASS_ENV)}>Unlock</Button>
        </CardContent>
      </Card>
    )
  }

  const updatePayload = (k: string, v: any) => setPayload((p: any) => ({ ...p, [k]: v }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="Name" value={payload.name} onChange={(e) => updatePayload("name", e.target.value)} />
          <Input placeholder="Email" value={payload.email} onChange={(e) => updatePayload("email", e.target.value)} />
          <Input
            placeholder="Headline"
            value={payload.headline}
            onChange={(e) => updatePayload("headline", e.target.value)}
          />
          <Input
            placeholder='Skills (comma separated, e.g., "python, flask, sql")'
            value={(payload.skills || []).join(", ")}
            onChange={(e) =>
              updatePayload(
                "skills",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
          <Input
            placeholder='Links JSON (e.g., {"github":"...","linkedin":"..."})'
            value={JSON.stringify(payload.links || {})}
            onChange={(e) => {
              try {
                updatePayload("links", JSON.parse(e.target.value || "{}"))
              } catch {}
            }}
          />
        </div>
        <Textarea placeholder="Bio" value={payload.bio} onChange={(e) => updatePayload("bio", e.target.value)} />
        <Textarea
          placeholder='Projects JSON array e.g., [{"title":"Me-API","description":"...","links":["https://..."]}]'
          value={JSON.stringify(payload.projects || [])}
          onChange={(e) => {
            try {
              updatePayload("projects", JSON.parse(e.target.value || "[]"))
            } catch {}
          }}
          className="h-40"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={async () => {
              const resp = await apiPost<{ id: string }>("profiles", payload)
              setProfileId(resp.id)
              alert(`Created profile ${resp.id}`)
            }}
          >
            Create
          </Button>
          <Input
            placeholder="Existing Profile ID"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="secondary"
            onClick={async () => {
              if (!profileId) return alert("Provide profile id")
              await apiPatch<{ id: string }>(`profiles/${profileId}`, payload)
              alert("Updated!")
            }}
          >
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
