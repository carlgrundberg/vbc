import configPromise from '@payload-config';
import { getPayload } from 'payload';
import MeetingCard from '@/components/meeting-card';
import { User } from '@/payload-types';

export const dynamic = 'force-static';
export const revalidate = 600;

export default async function Page() {
  const payload = await getPayload({ config: configPromise });

  const upcomingMeetings = await payload.find({
    collection: 'meetings',
    depth: 1,
    sort: 'date',
    where: {
      date: {
        greater_than: new Date(),
      },
    },
  });

  const previousMeetings = await payload.find({
    collection: 'meetings',
    depth: 1,
    limit: 25,
    sort: '-date',
    where: {
      date: {
        less_than: new Date(),
      },
    },
  });

  const nextHost = [
    ...new Set(
      previousMeetings.docs
        .map((meeting) => meeting.hosts as User[])
        .flat()
        .map((host) => host.name),
    ),
  ].pop();

  return (
    <div className="max-w-md mx-auto md:max-w-2xl flex flex-col gap-4">
      <h2 className="text-2xl font-bold dark:text-white">Upcoming</h2>
      {upcomingMeetings.docs.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
      {upcomingMeetings.docs.length === 0 && (
        <p className="text-gray-700 dark:text-gray-500">
          No meeting planned, {nextHost} is next up!
        </p>
      )}
      <h2 className="text-2xl font-bold dark:text-white">History</h2>
      {previousMeetings.docs.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}
