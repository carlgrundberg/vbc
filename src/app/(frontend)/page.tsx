import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { formatDateTime } from '@/lib/utils'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const meetings = await payload.find({
    collection: 'meetings',
    depth: 1,
    limit: 25,
    sort: '-date',
  })

  return (
    <>
      {meetings.docs.map((meeting) => {
        return (
          <div
            key={meeting.id}
            className="max-w-md mx-auto rounded-xl overflow-hidden md:max-w-2xl m-3 bg-gray-200 dark:bg-gray-900"
          >
            <div className="p-4 flex items-center">
              <div className="p-2 text-center">
                <p className="text-4xl font-bold dark:text-white">#{meeting.number}</p>
              </div>
              <div className="ml-4">
                <div className="capitalize text-sm dark:text-white font-semibold">
                  {typeof meeting.date === 'string' && formatDateTime(meeting.date)}
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-500">
                  {meeting.hosts
                    ?.map((host) => {
                      if (typeof host === 'object') {
                        return host.name
                      }
                    })
                    .join(', ')}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
