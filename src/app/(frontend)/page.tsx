import configPromise from '@payload-config';
import { getPayload } from 'payload';
import MeetingsList from '@/components/meetings-list';
import { nextOpenHostingTurn } from '@/lib/host-rotation';

export const dynamic = 'force-dynamic';

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

  const nextHost = nextOpenHostingTurn(previousMeetings.docs, upcomingMeetings.docs);

  return (
    <MeetingsList
      upcoming={upcomingMeetings.docs}
      previous={previousMeetings.docs}
      nextHost={nextHost ?? undefined}
    />
  );
}
