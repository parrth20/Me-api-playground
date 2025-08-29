"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { apiGet, type Profile } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"

type Props = {
  onSelectProfile: (id: string) => void
  onSkillChanged?: (skill: string) => void
}

function useQueryParam(key: string) {
  const params = useSearchParams()
  const [value, setValue] = useState<string>(params.get(key) || "")
  useEffect(() => {
    setValue(params.get(key) || "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()])
  return [value, setValue] as const
}

export default function SearchPanel({ onSelectProfile, onSkillChanged }: Props) {
  const router = useRouter()
  const [q, setQ] = useQueryParam("q")
  const [skill, setSkill] = useQueryParam("skill")
  const [resultsPage, setResultsPage] = useState(1)
  const pageSize = 8

  const {
    data: searchResults,
    isLoading: loadingSearch,
    mutate: runSearch,
  } = useSWR<Profile[]>(q ? `search:${q}` : null, () => apiGet<Profile[]>(`search?q=${encodeURIComponent(q)}`))

  const {
    data: skillResults,
    isLoading: loadingSkill,
    mutate: runSkill,
  } = useSWR<Profile[]>(skill ? `skill:${skill}` : null, () =>
    apiGet<Profile[]>(`profiles/by-skill?skill=${encodeURIComponent(skill)}`),
  )

  const results: Profile[] = useMemo(() => {
    const arr = skill ? skillResults || [] : searchResults || []
    return arr
  }, [skill, skillResults, searchResults])

  // Saved searches in localStorage
  const [saved, setSaved] = useState<string[]>([])
  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("savedSearches") || "[]")
    setSaved(Array.isArray(s) ? s : [])
  }, [])
  const saveSearch = () => {
    if (!q && !skill) return
    const label = q ? `q:${q}` : `skill:${skill}`
    const updated = Array.from(new Set([label, ...saved])).slice(0, 10)
    setSaved(updated)
    localStorage.setItem("savedSearches", JSON.stringify(updated))
  }
  const loadSaved = (label: string) => {
    if (label.startsWith("q:")) {
      const v = label.slice(2)
      setSkill("")
      setQ(v)
      router.replace(`/?q=${encodeURIComponent(v)}`)
      runSearch()
    } else if (label.startsWith("skill:")) {
      const v = label.slice(6)
      setQ("")
      setSkill(v)
      router.replace(`/?skill=${encodeURIComponent(v)}`)
      runSkill()
      onSkillChanged?.(v)
    }
  }

  // derive simple skill counts from visible results
  const skillCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    results.forEach((p) => (p.skills || []).forEach((s) => (counts[s] = (counts[s] || 0) + 1)))
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }, [results])

  const totalPages = Math.max(1, Math.ceil((results?.length || 0) / pageSize))
  const paged = results?.slice((resultsPage - 1) * pageSize, resultsPage * pageSize) || []

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-pretty">Explore profiles and projects</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search name, headline, or bio"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="font-sans"
            />
            <Button
              onClick={() => {
                setSkill("")
                router.replace(q ? `/?q=${encodeURIComponent(q)}` : "/")
                runSearch()
              }}
              disabled={!q}
            >
              Search
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Filter by skill (e.g., python)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="font-sans"
            />
            <Button
              variant="secondary"
              onClick={() => {
                setQ("")
                router.replace(skill ? `/?skill=${encodeURIComponent(skill)}` : "/")
                runSkill()
                onSkillChanged?.(skill)
              }}
              disabled={!skill}
            >
              By Skill
            </Button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {skillCounts.map(([s, c]) => (
            <Badge
              key={s}
              className="cursor-pointer"
              onClick={() => {
                setSkill(s)
                setQ("")
                router.replace(`/?skill=${encodeURIComponent(s)}`)
                runSkill()
                onSkillChanged?.(s)
              }}
            >
              {s} · {c}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {saved.map((label) => (
            <Button key={label} variant="outline" size="sm" onClick={() => loadSaved(label)}>
              {label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={saveSearch} disabled={!q && !skill}>
            Save current
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {loadingSearch || loadingSkill ? "Loading..." : `${results?.length || 0} result(s)`}
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paged.map((r) => (
              <li key={r.id} className="border rounded-lg p-4 bg-background">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-balance">{r.name}</h4>
                    <p className="text-sm text-muted-foreground">{r.headline}</p>
                  </div>
                  <Button size="sm" onClick={() => onSelectProfile(r.id)}>
                    View
                  </Button>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {(r.skills || []).slice(0, 6).map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-muted-foreground">
              Page {resultsPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setResultsPage((p) => Math.max(1, p - 1))}
                disabled={resultsPage === 1}
              >
                Prev
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setResultsPage((p) => Math.min(totalPages, p + 1))}
                disabled={resultsPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
