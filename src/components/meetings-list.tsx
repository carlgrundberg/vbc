'use client';

import { useState } from 'react';
import MeetingCardExpanded from '@/components/meeting-card-expanded';
import MeetingCardCompact from '@/components/meeting-card-compact';
import { Meeting } from '@/payload-types';

type MeetingsListProps = {
  upcoming: Meeting[];
  previous: Meeting[];
  nextHost?: string;
};

export default function MeetingsList({ upcoming, previous, nextHost }: MeetingsListProps) {
  const [compact, setCompact] = useState(false);

  return (
    <div className="max-w-md mx-auto md:max-w-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">Upcoming</h2>
        <button
          type="button"
          onClick={() => setCompact((c) => !c)}
          className="text-sm px-3 py-1 rounded-md bg-gray-300 dark:bg-gray-700 dark:text-white"
          aria-pressed={compact}
          aria-label="Toggle compact view"
        >
          {compact ? 'Expanded view' : 'Compact view'}
        </button>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-500">
          No meeting planned, {nextHost} is next up!
        </p>
      ) : (
        <p className="text-gray-700 dark:text-gray-500">Next up is {nextHost}!</p>
      )}
      {upcoming.map((meeting) =>
        compact ? (
          <MeetingCardCompact key={meeting.id} meeting={meeting} />
        ) : (
          <MeetingCardExpanded key={meeting.id} meeting={meeting} />
        ),
      )}

      <h2 className="text-2xl font-bold dark:text-white">History</h2>
      {previous.map((meeting) =>
        compact ? (
          <MeetingCardCompact key={meeting.id} meeting={meeting} />
        ) : (
          <MeetingCardExpanded key={meeting.id} meeting={meeting} />
        ),
      )}
    </div>
  );
}
