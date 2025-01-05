import { formatDateTime } from '@/lib/utils';
import { Meeting } from '@/payload-types';

const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
  return (
    <div className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-900">
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
  );
};

export default MeetingCard;
