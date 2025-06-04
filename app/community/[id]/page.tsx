"use client"

import { MuralContent } from "@/components/mural-content"
import { useParams } from "next/navigation"

export default function CommunityPage() {
  const params = useParams()
  const communityId = params.id as string

  return (
    <div className="min-h-screen bg-[#FFEDC1] w-full pt-20">
      <MuralContent communityId={communityId} />
    </div>
  )
}
