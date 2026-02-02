import { useApp } from '@/contexts/AppContext';
import { colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDashboardMode } from '@/hooks/useDashboardMode';
import { useWorkViewData } from '@/hooks/useWorkViewData';
import { useHireViewData } from '@/hooks/useHireViewData';
import { router } from 'expo-router';
import { useRef } from 'react';
import * as Haptics from 'expo-haptics';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
  Animated,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Clock, 
  DollarSign,
  Plus,
  TrendingUp,
  CalendarClock,
  ChevronLeft,
  Coins,
  Sparkles,
  Languages,
} from 'lucide-react-native';
import { Tender } from '@/types';
import { formatDate, getStatusColor, getStatusText } from '@/utils/formatting';
import EmptyState from '@/components/EmptyState';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function UnifiedDashboard() {
  const { currentUser, tenders, addCredits } = useApp();
  const { mode, handleModeChange } = useDashboardMode();
  const { myWork, monthlyEarnings, upcomingShifts } = useWorkViewData(currentUser, tenders);
  const { myTenders, hasNoCredits, hasLowCredits } = useHireViewData(currentUser, tenders);
  const { language, switchLanguage, t } = useLanguage();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={mode === 'work' ? ['#ECFDF5', '#F0FDF4', colors.background] : ['#EEF2FF', '#F8FAFC', colors.background]}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <BlurView intensity={90} tint="light" style={styles.header}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                switchLanguage(language === 'he' ? 'en' : 'he');
              }}
            >
              <Languages size={20} color={mode === 'work' ? colors.success : colors.primary} />
              <Text style={[styles.languageText, { color: mode === 'work' ? colors.successDark : colors.primary }]}>
                {language === 'he' ? 'EN' : 'HE'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={[styles.avatarPlaceholder, { shadowColor: mode === 'work' ? colors.success : colors.primary }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/settings');
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={mode === 'work' ? [colors.success, colors.successDark] : [colors.primaryLight, colors.primary]}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>
                  {currentUser?.name?.charAt(0) || 'U'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{t('dashboard.greeting')}, {currentUser?.name || 'משתמש'}</Text>
              {mode === 'hire' && (
                <View style={styles.creditsRow}>
                  <TouchableOpacity 
                    style={[
                      styles.creditsButton,
                      {
                        backgroundColor: 'rgba(251, 191, 36, 0.1)',
                        borderColor: 'rgba(251, 191, 36, 0.3)',
                      }
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      if (currentUser) {
                        addCredits(currentUser.id, 10);
                      }
                    }}
                  >
                    <Coins size={16} color={colors.warning} />
                    <Text style={[styles.creditsText, { color: colors.warningDark }]}>{currentUser?.credits || 0} {t('dashboard.credits')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </BlurView>

        <View style={styles.modeToggleContainer}>
          <BlurView intensity={80} tint="light" style={styles.modeToggle}>
            <Pressable
              style={[
                styles.modeButton,
                mode === 'work' && styles.modeButtonActive,
                mode === 'work' && { shadowColor: colors.success },
              ]}
              onPress={() => {
                animateButton();
                handleModeChange('work');
              }}
            >
              {mode === 'work' && (
                <LinearGradient
                  colors={[colors.success, colors.successDark]}
                  style={styles.modeButtonGradient}
                />
              )}
              <Briefcase
                size={20}
                color={mode === 'work' ? colors.background : colors.textMuted}
                style={{ zIndex: 1 }}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'work' && styles.modeButtonTextActive,
                ]}
              >
                {t('dashboard.modeWork')}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                mode === 'hire' && styles.modeButtonActive,
              ]}
              onPress={() => {
                animateButton();
                handleModeChange('hire');
              }}
            >
              {mode === 'hire' && (
                <LinearGradient
                  colors={[colors.primaryLight, colors.primary]}
                  style={styles.modeButtonGradient}
                />
              )}
              <Users
                size={20}
                color={mode === 'hire' ? colors.background : colors.textMuted}
                style={{ zIndex: 1 }}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'hire' && styles.modeButtonTextActive,
                ]}
              >
                {t('dashboard.modeHire')}
              </Text>
            </Pressable>
          </BlurView>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {mode === 'work' ? (
            <WorkView
              tenders={myWork}
              currentUser={currentUser}
              monthlyEarnings={monthlyEarnings}
              upcomingShifts={upcomingShifts}
              t={t}
            />
          ) : (
            <HireView tenders={myTenders} hasNoCredits={hasNoCredits} hasLowCredits={hasLowCredits} t={t} />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function WorkView({
  tenders,
  currentUser,
  monthlyEarnings,
  upcomingShifts,
  t,
}: {
  tenders: Tender[];
  currentUser: any;
  monthlyEarnings: number;
  upcomingShifts: number;
  t: (key: string) => string;
}) {
  const getInviteForUser = (tender: Tender) => {
    return tender.invites.find((inv) => inv.userId === currentUser?.id);
  };

  const getStatusBadge = (tender: Tender) => {
    const invite = getInviteForUser(tender);
    if (!invite) return null;

    switch (invite.status) {
      case 'pending':
        return { text: t('dashboard.statusPending'), color: colors.warning, bg: 'rgba(251, 191, 36, 0.15)' };
      case 'accepted':
        return { text: t('dashboard.statusAccepted'), color: colors.successDark, bg: 'rgba(16, 185, 129, 0.15)' };
      case 'rejected':
        return { text: t('dashboard.statusRejected'), color: colors.error, bg: 'rgba(239, 68, 68, 0.15)' };
      default:
        return { text: invite.status, color: colors.textMuted, bg: 'rgba(156, 163, 175, 0.15)' };
    }
  };

  return (
    <>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardPrimary, { shadowColor: colors.success }]}>
          <LinearGradient
            colors={[colors.success, colors.successDark, colors.successDarker]}
            style={styles.statCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <TrendingUp size={24} color={colors.background} />
            </View>
            <Text style={styles.statValue}>₪{monthlyEarnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>{t('dashboard.monthlyEarnings')}</Text>
          </LinearGradient>
        </View>

        <View style={styles.statCard}>
          <BlurView intensity={60} tint="light" style={styles.statCardBlur}>
            <View style={[styles.statIconContainer, styles.statIconSecondary]}>
              <CalendarClock size={24} color={colors.success} />
            </View>
            <Text style={styles.statValueSecondary}>{upcomingShifts}</Text>
            <Text style={styles.statLabelSecondary}>{t('dashboard.upcomingShifts')}</Text>
          </BlurView>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('dashboard.openInvitations')}</Text>

        {tenders.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={t('dashboard.noInvitations')}
            subtitle={t('dashboard.noInvitationsDesc')}
            iconColor={colors.borderLight}
          />
        ) : (
          tenders.map((tender, index) => {
            const status = getStatusBadge(tender);
            const invite = getInviteForUser(tender);

            if (!status || !invite) return null;

            return (
              <MotiView
                key={tender.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: index * 100 }}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.tenderCard,
                    pressed && styles.tenderCardPressed,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({ pathname: '/participant/tender-details', params: { id: tender.id } });
                  }}
                >
                  <View style={styles.tenderHeader}>
                    <View
                      style={[styles.statusBadge, { backgroundColor: status.bg }]}
                    >
                      <Text style={[styles.statusText, { color: status.color }]}>
                        {status.text}
                      </Text>
                    </View>
                    <Text style={styles.tenderTitle}>{tender.title}</Text>
                  </View>

                  <View style={styles.organizerInfo}>
                    <Text style={styles.organizerText}>
                      {t('dashboard.by')} {tender.organizerName}
                    </Text>
                  </View>

                  <View style={styles.tenderDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailText}>{formatDate(tender.date)}</Text>
                      <Calendar size={16} color={colors.textMuted} />
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailText}>
                        {tender.startTime} - {tender.endTime}
                      </Text>
                      <Clock size={16} color={colors.textMuted} />
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.payText}>₪{tender.pay}</Text>
                      <DollarSign size={16} color={colors.successDark} />
                    </View>
                  </View>

                  {invite.status === 'pending' && (
                    <View style={styles.pendingIndicator}>
                      <Text style={styles.pendingText}>{t('dashboard.clickToRespond')}</Text>
                    </View>
                  )}
                </Pressable>
              </MotiView>
            );
          })
        )}
      </View>
    </>
  );
}

function HireView({ tenders, hasNoCredits, hasLowCredits, t }: { tenders: Tender[]; hasNoCredits: boolean; hasLowCredits: boolean; t: (key: string) => string }) {
  const getAcceptedCount = (tender: Tender) => {
    return tender.invites.filter((inv) => inv.status === 'accepted').length;
  };

  return (
    <>
      {hasLowCredits && (
        <TouchableOpacity style={styles.creditsBanner} activeOpacity={0.8}>
          <LinearGradient
            colors={hasNoCredits ? [colors.errorLight, colors.error] : [colors.warning, colors.warningDark]}
            style={styles.creditsBannerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Sparkles size={24} color={colors.background} />
            <View style={styles.creditsBannerContent}>
              <Text style={styles.creditsBannerTitle}>
                {hasNoCredits ? t('dashboard.creditsOut') : t('dashboard.creditsLow')}
              </Text>
              <Text style={styles.creditsBannerSubtitle}>
                {hasNoCredits ? t('dashboard.creditsOutDesc') : t('dashboard.creditsLowDesc')}
              </Text>
            </View>
            <ChevronLeft size={20} color={colors.background} />
          </LinearGradient>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.createTenderCTA}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/organizer/create-tender');
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.primaryLight, colors.primary]}
          style={styles.ctaGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.ctaIconContainer}>
            <Plus size={32} color={colors.background} />
          </View>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>{t('dashboard.createTenderCTA')}</Text>
            <Text style={styles.ctaSubtitle}>{t('dashboard.createTenderDesc')}</Text>
          </View>
          <ChevronLeft size={24} color={colors.background} />
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('dashboard.myTenders')}</Text>

        {tenders.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t('dashboard.noTenders')}
            subtitle={t('dashboard.noTendersDesc')}
            iconColor={colors.borderLight}
          />
        ) : (
          tenders.map((tender, index) => {
            const acceptedCount = getAcceptedCount(tender);
            const progress = tender.quota > 0 ? (acceptedCount / tender.quota) * 100 : 0;

            return (
              <MotiView
                key={tender.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: index * 100 }}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.tenderCard,
                    pressed && styles.tenderCardPressed,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({ pathname: '/organizer/tender-details', params: { id: tender.id } });
                  }}
                >
                  <View style={styles.tenderHeader}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor(tender.status)}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(tender.status) },
                        ]}
                      >
                        {getStatusText(tender.status)}
                      </Text>
                    </View>
                    <Text style={styles.tenderTitle}>{tender.title}</Text>
                  </View>

                  <View style={styles.tenderDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailText}>{formatDate(tender.date)}</Text>
                      <Calendar size={16} color={colors.textMuted} />
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailText}>
                        {tender.startTime} - {tender.endTime}
                      </Text>
                      <Clock size={16} color={colors.textMuted} />
                    </View>
                  </View>

                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressCount}>
                        {acceptedCount} / {tender.quota}
                      </Text>
                      <Text style={styles.progressLabel}>{t('dashboard.workers')}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor:
                              progress >= 100
                                ? colors.successDark
                                : progress >= 70
                                ? colors.warning
                                : colors.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </Pressable>
              </MotiView>
            );
          })
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  headerButtons: {
    position: 'absolute',
    top: 16,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  headerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.background,
  },
  headerText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  creditsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  creditsButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  creditsText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  modeToggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modeToggle: {
    flexDirection: 'row-reverse',
    borderRadius: 16,
    padding: 4,
    gap: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    position: 'relative',
  },
  modeButtonActive: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modeButtonGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textMuted,
    zIndex: 1,
  },
  modeButtonTextActive: {
    color: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  statCardPrimary: {},
  statCardGradient: {
    padding: 20,
  },
  statCardBlur: {
    padding: 20,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIconSecondary: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.background,
    marginBottom: 4,
    textAlign: 'right',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
    fontWeight: '500' as const,
  },
  statValueSecondary: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'right',
  },
  statLabelSecondary: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'right',
    fontWeight: '500' as const,
  },
  creditsBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  creditsBannerGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  creditsBannerContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  creditsBannerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.background,
    marginBottom: 2,
  },
  creditsBannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  createTenderCTA: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  ctaIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.background,
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.textMuted,
    marginTop: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  tenderCard: {
    backgroundColor: colors.glassBackground,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.glassBackgroundStrong,
  },
  tenderCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  tenderHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tenderTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    flex: 1,
    marginRight: 8,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  organizerInfo: {
    marginBottom: 12,
  },
  organizerText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'right',
  },
  tenderDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  payText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.successDark,
  },
  pendingIndicator: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.warning,
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
