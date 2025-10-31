import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { formatDateTime } from '@/lib/utils';
import { Meeting, Media } from '@/payload-types';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const revalidate = 600;

export default async function MeetingDetailsPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const payload = await getPayload({ config: configPromise });

  const meetings = await payload.find({
    collection: 'meetings',
    depth: 2,
    where: {
      number: {
        equals: Number.parseInt(number, 10),
      },
    },
  });

  const meeting = meetings.docs[0];
  if (!meeting) {
    notFound();
  }

  const coverPhoto = typeof meeting.coverPhoto === 'object' ? meeting.coverPhoto : null;
  const flights = meeting.flights || [];

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to meetings
      </Link>

      <div className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-900">
        {coverPhoto?.url && (
          <div className="w-full h-64 overflow-hidden">
            <Image
              src={coverPhoto.url}
              alt={coverPhoto.alt || `Cover photo for meeting ${meeting.number}`}
              width={1600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 text-center bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-5xl font-bold dark:text-white">#{meeting.number}</p>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <h1 className="text-2xl font-bold capitalize dark:text-white">
                {meeting.title || `Meeting #${meeting.number}`}
              </h1>
              <p className="text-gray-700 dark:text-gray-400 text-lg">
                {typeof meeting.date === 'string' && formatDateTime(meeting.date)}
              </p>
              {meeting.hosts && meeting.hosts.length > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-500 text-sm">Hosted by: </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {meeting.hosts
                      .map((host) => {
                        if (typeof host === 'object') {
                          return host.name;
                        }
                        return null;
                      })
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )}
              {meeting.attendees && meeting.attendees.length > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-500 text-sm">Attendees: </span>
                  <span className="text-gray-900 dark:text-white">
                    {meeting.attendees
                      .map((attendee) => {
                        if (typeof attendee === 'object') {
                          return attendee.name;
                        }
                        return null;
                      })
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {flights.length > 0 && (
            <div className="mt-8">
              <div className="space-y-8">
                {flights.map((flight, flightIndex) => (
                  <div key={flightIndex}>
                    <h3 className="text-lg font-semibold dark:text-white mb-4">
                      {flight.name || `Flight #${flightIndex + 1}`}
                    </h3>
                    {flight.items && flight.items.length > 0 && (
                      <div className="space-y-3">
                        {flight.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
                          >
                            <span className="text-gray-600 dark:text-gray-400 font-mono text-sm min-w-[2rem]">
                              {itemIndex + 1}.
                            </span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {item.title}
                            </a>
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
