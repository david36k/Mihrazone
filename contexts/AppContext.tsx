import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Tender, Contact, Group, InviteStatus } from '@/types';
import { MOCK_USERS, MOCK_TENDERS, MOCK_CONTACTS, MOCK_GROUPS } from '@/constants/mock-data';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const [AppProvider, useApp] = createContextHook(() => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tenders, setTenders] = useState<Tender[]>(MOCK_TENDERS);
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [groups] = useState<Group[]>(MOCK_GROUPS);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const storedUserId = await AsyncStorage.getItem('currentUserId');
    if (storedUserId) {
      const user = MOCK_USERS.find((u) => u.id === storedUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
  };

  const switchUser = async (userId: string) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) {
      await AsyncStorage.setItem('currentUserId', userId);
      setCurrentUser(user);
    }
  };

  const createTender = useCallback((tender: Omit<Tender, 'id' | 'createdAt' | 'status'>) => {
    const newTender: Tender = {
      ...tender,
      id: `tender-${Date.now()}`,
      status: 'open',
      createdAt: new Date(),
    };
    setTenders((prev) => [newTender, ...prev]);
    return newTender;
  }, []);

  const updateInviteStatus = useCallback(
    (tenderId: string, userId: string, status: InviteStatus) => {
      setTenders((prev) =>
        prev.map((tender) => {
          if (tender.id !== tenderId) return tender;

          const updatedInvites = tender.invites.map((invite) =>
            invite.userId === userId
              ? { ...invite, status, updatedAt: new Date() }
              : invite
          );

          const acceptedCount = updatedInvites.filter((inv) => inv.status === 'accepted').length;
          const newStatus = acceptedCount >= tender.quota ? 'full' : tender.status;

          return {
            ...tender,
            invites: updatedInvites,
            status: newStatus,
          };
        })
      );
    },
    []
  );

  const getTenderById = useCallback(
    (tenderId: string) => {
      return tenders.find((t) => t.id === tenderId);
    },
    [tenders]
  );

  return {
    currentUser,
    switchUser,
    tenders,
    contacts,
    groups,
    createTender,
    updateInviteStatus,
    getTenderById,
    mockUsers: MOCK_USERS,
  };
});

export const useParticipantTenders = () => {
  const { currentUser, tenders } = useApp();

  return useMemo(() => {
    if (!currentUser) return { active: [], history: [] };

    const now = new Date();

    const userTenders = tenders.filter((tender) =>
      tender.invites.some((invite) => invite.userId === currentUser.id)
    );

    const active = userTenders.filter((tender) => {
      const invite = tender.invites.find((inv) => inv.userId === currentUser.id);
      if (!invite) return false;

      const isPending = invite.status === 'pending';
      const isFutureAccepted = invite.status === 'accepted' && tender.date >= now;

      return isPending || isFutureAccepted;
    });

    const history = userTenders.filter((tender) => {
      const invite = tender.invites.find((inv) => inv.userId === currentUser.id);
      if (!invite) return false;

      const isPast = tender.date < now;
      const isRejected = invite.status === 'rejected';

      return isPast || isRejected;
    });

    return { active, history };
  }, [currentUser, tenders]);
};

export const useOrganizerTenders = () => {
  const { currentUser, tenders } = useApp();

  return useMemo(() => {
    if (!currentUser || currentUser.role !== 'organizer') return [];

    return tenders.filter((tender) => tender.organizerId === currentUser.id);
  }, [currentUser, tenders]);
};
