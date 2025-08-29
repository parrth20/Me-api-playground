"use client"

import useSWR from "swr"
import { apiGet, type Profile } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePanel({ profileId }: { profileId?: string }) {
  const { data, isLoading } = useSWR<Profile>(profileId ? `profile:${profileId}` : null, () =>
    apiGet<Profile>(`profiles/${profileId}`),
  )

  if (!profileId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Select a profile from results to preview it here.
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Loading...</CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">{data.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.headline ? <p className="text-sm text-muted-foreground">{data.headline}</p> : null}
        {data.bio ? <p className="text-sm">{data.bio}</p> : null}
        <div className="flex gap-2 flex-wrap">
          {(data.skills || []).map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {data.links?.github ? (
            <Button asChild size="sm" variant="outline">
              <a href={data.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
          ) : null}
          {data.links?.linkedin ? (
            <Button asChild size="sm" variant="outline">
              <a href={data.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </Button>
          ) : null}
          {data.links?.portfolio ? (
            <Button asChild size="sm" variant="outline">
              <a href={data.links.portfolio} target="_blank" rel="noreferrer">
                Portfolio
              </a>
            </Button>
          ) : null}
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Projects</h4>
          <ul className="space-y-2">
            {(data.projects || []).map((pr, i) => (
              <li key={i} className="border rounded-md p-3">
                <div className="font-medium">{pr.title}</div>
                <div className="text-sm text-muted-foreground">{pr.description}</div>
                {pr.links?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pr.links.map((l, idx) => (
                      <a key={idx} href={l} target="_blank" rel="noreferrer" className="text-xs underline">
                        {l}
                      </a>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
