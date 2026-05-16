import type { Meeting } from '@/payload-types';

function hostDisplayNames(hosts: Meeting['hosts']): string[] {
  if (!hosts?.length) return [];
  const names: string[] = [];
  for (const h of hosts) {
    if (typeof h === 'object' && typeof h?.name === 'string') {
      const trimmed = h.name.trim();
      if (trimmed) names.push(trimmed);
    }
  }
  return names;
}

/**
 * Guess who hosts the next meeting **not yet in CMS**.
 * Mirrors the historic `[ ...new Set(flat)].pop()` rule, then walks backward over that
 * unique list skipping anyone already assigned host on any **future** meeting.
 */
export function nextOpenHostingTurn(
  previousMeetingsNewestFirst: Meeting[],
  upcomingMeetings: Meeting[],
): string | undefined {
  const excluded = new Set(upcomingMeetings.flatMap((m) => hostDisplayNames(m.hosts)));

  const historicSequence = previousMeetingsNewestFirst.flatMap((m) => hostDisplayNames(m.hosts));
  const uniqueHistoric = [...new Set(historicSequence)];

  for (let i = uniqueHistoric.length - 1; i >= 0; i--) {
    const candidate = uniqueHistoric[i];
    if (!excluded.has(candidate)) return candidate;
  }

  return undefined;
}
