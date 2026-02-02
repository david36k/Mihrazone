import { useMemo } from 'react';
import type { User } from '@/types';
import type { Tender } from '@/types';

export function useWorkViewData(currentUser: User | null, tenders: Tender[]) {
  const myWork = useMemo(() => {
    if (!currentUser) return [];
    return tenders.filter((t) =>
      t.invites.some((invite) => invite.userId === currentUser.id)
    );
  }, [currentUser, tenders]);

  const monthlyEarnings = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return myWork
      .filter((t) => {
        const invite = t.invites.find((inv) => inv.userId === currentUser?.id);
        const tenderMonth = t.date.getMonth();
        const tenderYear = t.date.getFullYear();
        return (
          invite?.status === 'accepted' &&
          tenderMonth === currentMonth &&
          tenderYear === currentYear &&
          t.date <= now
        );
      })
      .reduce((sum, t) => sum + t.pay, 0);
  }, [myWork, currentUser]);

  const upcomingShifts = useMemo(() => {
    const now = new Date();
    return myWork.filter((t) => {
      const invite = t.invites.find((inv) => inv.userId === currentUser?.id);
      return invite?.status === 'accepted' && t.date >= now;
    }).length;
  }, [myWork, currentUser]);

  return { myWork, monthlyEarnings, upcomingShifts };
}
