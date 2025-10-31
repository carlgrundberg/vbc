import { formatDateTime } from '@/lib/utils';
import { Meeting, Media } from '@/payload-types';
import Image from 'next/image';
import Link from 'next/link';

export default function MeetingCardExpanded({
  meeting,
}: {
  meeting: Meeting & { coverPhoto?: number | Media | null };
}) {
  const coverPhoto = typeof meeting.coverPhoto === 'object' ? meeting.coverPhoto : null;

  return (
    <Link href={`/meetings/${meeting.number}`} className="block">
      <div className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer">
        {coverPhoto?.url && (
          <div className="w-full h-48 overflow-hidden">
            <Image
              src={coverPhoto.url}
              alt={coverPhoto.alt || `Cover photo for meeting ${meeting.number}`}
              width={1600}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 text-center">
            <p className="text-4xl font-bold dark:text-white">#{meeting.number}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="capitalize text-sm dark:text-white font-semibold">
              {meeting.title}
              {meeting.hosts
                ?.map((host) => {
                  if (typeof host === 'object') {
                    return host.name;
                  }
                })
                .join(', ')}
            </div>
            <p className="text-gray-700 dark:text-gray-500">
              {typeof meeting.date === 'string' && formatDateTime(meeting.date)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
