import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { formatDateTime } from '@/lib/utils';
import { Meeting, Media } from '@/payload-types';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react/jsx-runtime';

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

      {coverPhoto?.url && (
        <div className="w-full h-64 overflow-hidden mb-6">
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

      <div className="flex items-start gap-4 mb-8">
        <div className="flex flex-col gap-2 flex-1">
          <h1 className="text-2xl font-bold capitalize dark:text-white">
            Meeting #{meeting.number}
            {meeting.title && ` - ${meeting.title}`}
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
        <div className="space-y-8">
          {flights.map((flight, flightIndex) => (
            <div key={flightIndex}>
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                {flight.name || `Flight #${flightIndex + 1}`}
              </h3>
              {flight.items && flight.items.length > 0 && (
                <div className="space-y-3">
                  {flight.items.map((item, itemIndex) => (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={itemIndex}
                      className="block p-3 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg text-gray-900 dark:text-gray-100 font-mono min-w-[2rem] text-center self-stretch flex items-center justify-center">
                          {itemIndex + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {item.title}
                          </div>
                          {(item.brewery || item.style || item.abv != null || item.ibu != null) && (
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                              {[
                                item.brewery,
                                item.style,
                                item.abv ? `${item.abv}% ABV` : null,
                                item.ibu ? `${item.ibu} IBU` : null,
                              ]
                                .filter(Boolean)
                                .map((value, index) => (
                                  <Fragment key={index}>
                                    {index > 0 && <span>•</span>}
                                    <span>{value}</span>
                                  </Fragment>
                                ))}
                            </div>
                          )}
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400 shrink-0"
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
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
