import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { User } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const meetings = await payload.find({
    collection: 'meetings',
    depth: 1,
    limit: 12,
    sort: '-date',
  })

  return (
    <>
      {meetings.docs.map((meeting) => {
        return (
          <div key={meeting.id} className="container mb-16">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl">
                #{meeting.number} {meeting.title}
              </h2>
              {meeting.date && <p>{new Date(meeting.date).toLocaleString()}</p>}
              {meeting.hosts != null && meeting.hosts.length > 0 && (
                <p>
                  Hosted by{' '}
                  {(meeting.hosts as User[]).map((host) => (
                    <span key={host.id}>{host.name}</span>
                  ))}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}
