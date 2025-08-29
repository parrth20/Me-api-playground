"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { apiGet } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ProjectItem = { owner: string; title: string; description?: string; links?: string[] }

export default function ProjectsGrid({ initialSkill }: { initialSkill?: string }) {
  const [skill, setSkill] = useState(initialSkill || "")
  const [sortBy, setSortBy] = useState<"title" | "owner">("title")
  const [page, setPage] = useState(1)
  const pageSize = 9

  const {
    data: projects,
    isLoading,
    mutate,
  } = useSWR<ProjectItem[]>(`projects:${skill || "all"}`, () =>
    apiGet<ProjectItem[]>(skill ? `projects?skill=${encodeURIComponent(skill)}` : "projects"),
  )

  const filtered = useMemo(() => {
    const list = projects || []
    const sorted = [...list].sort((a, b) => {
      const va = (a[sortBy] || "").toLowerCase()
      const vb = (b[sortBy] || "").toLowerCase()
      return va.localeCompare(vb)
    })
    return sorted
  }, [projects, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => setPage(1), [skill, sortBy])

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3">
        <CardTitle className="text-pretty">Projects</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex gap-2">
            <Input placeholder="Filter by skill" value={skill} onChange={(e) => setSkill(e.target.value)} />
            <Button variant="secondary" onClick={() => mutate()}>
              Apply
            </Button>
          </div>
          <div>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading projects...</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pageItems.map((p, i) => (
              <li key={`${p.title}-${i}`} className="border rounded-lg p-4 bg-background">
                <h4 className="font-semibold">{p.title}</h4>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-3 text-sm">
                  <span className="text-primary font-medium">By {p.owner}</span>
                </div>
                {p.links?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.links.map((l, idx) => (
                      <a
                        key={idx}
                        href={l}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs underline text-foreground/80"
                      >
                        {l}
                      </a>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
