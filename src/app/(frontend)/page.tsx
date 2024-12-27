import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const meetings = await payload.find({
    collection: 'meetings',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      number: true,
      date: true,
      host: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Meetings</h1>
        </div>
      </div>

      {meetings.docs.map((meeting) => {
        return (
          <div key={meeting.id} className="container mb-16">
            <div className="prose dark:prose-invert max-w-none">
              <h2>
                #{meeting.number} {meeting.title}
              </h2>
              {meeting.date && <p>{new Date(meeting.date).toLocaleString()}</p>}
              {meeting.host && typeof meeting.host === 'object' && <p>Host: {meeting.host.name}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `VBC Meetings`,
  }
}
