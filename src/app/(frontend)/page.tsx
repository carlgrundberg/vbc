import configPromise from '@payload-config';
import { getPayload } from 'payload';
import MeetingsList from '@/components/meetings-list';
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
    <MeetingsList
      upcoming={upcomingMeetings.docs}
      previous={previousMeetings.docs}
      nextHost={nextHost ?? undefined}
    />
  );
}
