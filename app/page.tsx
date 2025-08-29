"use client"

import { useState } from "react"
import SearchPanel from "@/components/search-panel"
import ProjectsGrid from "@/components/projects-grid"
import ProfilePanel from "@/components/profile-panel"
import AdminEditor from "@/components/admin-editor"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>()
  const [skill, setSkill] = useState<string | undefined>()

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-pretty">Me-API Playground</h1>
          <p className="text-sm text-muted-foreground">Search by skill, explore projects, and preview profiles.</p>
        </div>
        <div className="flex items-center gap-2">
          <a className="text-sm underline text-foreground/80" href="/api/me/health" target="_blank" rel="noreferrer">
            Health
          </a>
        </div>
      </header>

      <SearchPanel onSelectProfile={(id) => setSelectedProfileId(id)} onSkillChanged={(s) => setSkill(s)} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectsGrid initialSkill={skill} />
        </div>
        <div className="lg:col-span-1">
          <ProfilePanel profileId={selectedProfileId} />
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Admin</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
            }}
          >
            Go to bottom
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Use this lightweight editor to create or update your profile. Protect write operations by setting
          NEXT_PUBLIC_ADMIN_PASSCODE.
        </p>
        <AdminEditor />
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        Built with Flask, Postgres, and Next.js UI. Customize BACKEND_URL in project settings.
      </footer>
    </main>
  )
}
