import { formatDateTime } from '@/lib/utils';
import { Meeting, Media } from '@/payload-types';
import Image from 'next/image';
import Link from 'next/link';

export default function MeetingCardCompact({
  meeting,
}: {
  meeting: Meeting & { coverPhoto?: number | Media | null };
}) {
  const coverPhoto = typeof meeting.coverPhoto === 'object' ? meeting.coverPhoto : null;

  return (
    <Link href={`/meetings/${meeting.number}`} className="block">
      <div className="rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer">
        <div className="flex items-stretch gap-3 pl-2">
          <div className="px-2 text-center self-center py-2">
            <p className="text-xl font-bold dark:text-white">#{meeting.number}</p>
          </div>
          <div className="flex flex-col gap-1 flex-1 self-center py-2">
            <div className="capitalize text-xs dark:text-white font-semibold">
              {meeting.title}
              {meeting.hosts
                ?.map((host) => {
                  if (typeof host === 'object') {
                    return host.name;
                  }
                })
                .join(', ')}
            </div>
            <p className="text-gray-700 dark:text-gray-500 text-xs">
              {typeof meeting.date === 'string' && formatDateTime(meeting.date)}
            </p>
          </div>
          {coverPhoto?.url && (
            <div className="w-20 overflow-hidden shrink-0 self-stretch">
              <Image
                src={coverPhoto.url}
                alt={coverPhoto.alt || `Cover photo for meeting ${meeting.number}`}
                width={200}
                height={120}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
