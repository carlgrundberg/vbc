'use client';

import { useRowLabel } from '@payloadcms/ui';

export default function FlightItemRowLabel() {
  const { data, rowNumber } = useRowLabel<{ title?: string }>();

  return (
    <div className="text-lg font-semibold dark:text-white">
      {rowNumber}: {data.title || 'Unknown'}
    </div>
  );
}
