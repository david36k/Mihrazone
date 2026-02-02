import { useMemo } from 'react';
import type { User } from '@/types';
import type { Tender } from '@/types';

export function useHireViewData(currentUser: User | null, tenders: Tender[]) {
  const myTenders = useMemo(() => {
    if (!currentUser) return [];
    return tenders.filter((t) => t.organizerId === currentUser.id);
  }, [currentUser, tenders]);

  const hasLowCredits = currentUser && currentUser.credits < 3;
  const hasNoCredits = currentUser && currentUser.credits === 0;

  return { myTenders, hasLowCredits: !!hasLowCredits, hasNoCredits: !!hasNoCredits };
}
