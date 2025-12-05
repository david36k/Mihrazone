import { useOrganizerTenders, useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Plus, Calendar, Clock, Users, DollarSign, ChevronRight } from 'lucide-react-native';
import { Tender } from '@/types';

export default function OrganizerDashboard() {
  const tenders = useOrganizerTenders();
  const { currentUser } = useApp();

  const activeTenders = tenders.filter((t) => t.status !== 'closed');

  const getAcceptedCount = (tender: Tender) => {
    return tender.invites.filter((inv) => inv.status === 'accepted').length;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#3B82F6';
      case 'full':
        return '#059669';
      case 'closed':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'full':
        return 'Full';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, {currentUser?.name || 'Organizer'}</Text>
              <Text style={styles.subtitle}>Manage your job tenders</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/organizer/create-tender' as any)}
          >
            <Plus size={24} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Create New Tender</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Tenders ({activeTenders.length})</Text>

            {activeTenders.length === 0 ? (
              <View style={styles.emptyState}>
                <Users size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No active tenders</Text>
                <Text style={styles.emptyStateSubtext}>Create your first tender to get started</Text>
              </View>
            ) : (
              activeTenders.map((tender) => {
                const acceptedCount = getAcceptedCount(tender);
                const progress = tender.quota > 0 ? (acceptedCount / tender.quota) * 100 : 0;

                return (
                  <TouchableOpacity
                    key={tender.id}
                    style={styles.tenderCard}
                    onPress={() => router.push(`/organizer/tender-details?id=${tender.id}` as any)}
                  >
                    <View style={styles.tenderHeader}>
                      <Text style={styles.tenderTitle}>{tender.title}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: `${getStatusColor(tender.status)}20` },
                        ]}
                      >
                        <Text
                          style={[styles.statusText, { color: getStatusColor(tender.status) }]}
                        >
                          {getStatusText(tender.status)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.tenderDetails}>
                      <View style={styles.detailRow}>
                        <Calendar size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{formatDate(tender.date)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Clock size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          {tender.startTime} - {tender.endTime}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <DollarSign size={16} color="#6B7280" />
                        <Text style={styles.detailText}>₪{tender.pay}</Text>
                      </View>
                    </View>

                    <View style={styles.progressSection}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Workers</Text>
                        <Text style={styles.progressCount}>
                          {acceptedCount} / {tender.quota}
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(progress, 100)}%`,
                              backgroundColor:
                                progress >= 100 ? '#059669' : progress >= 70 ? '#F59E0B' : '#3B82F6',
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.tenderFooter}>
                      <Text style={styles.invitesText}>
                        {tender.invites.length} invites sent
                      </Text>
                      <ChevronRight size={20} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  tenderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  tenderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tenderTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  tenderDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#374151',
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  tenderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  invitesText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
