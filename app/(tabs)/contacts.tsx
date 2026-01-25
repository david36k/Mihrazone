import { useApp } from '@/contexts/AppContext';
import { useState, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { 
  Search,
  Users,
  User,
  Phone,
  Mail,
  Plus,
  UserPlus,
} from 'lucide-react-native';

export default function ContactsScreen() {
  const { contacts, groups } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState<'contacts' | 'groups'>('contacts');

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    const query = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.phone.includes(query)
    );
  }, [contacts, searchQuery]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    const query = searchQuery.toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(query));
  }, [groups, searchQuery]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#EEF2FF', '#F8FAFC', '#FFFFFF']}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <BlurView intensity={90} tint="light" style={styles.header}>
          <Text style={styles.headerTitle}>אנשי קשר</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              style={styles.addButtonGradient}
            >
              <UserPlus size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>

        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <BlurView intensity={80} tint="light" style={styles.searchBlur}>
              <Search size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="חיפוש..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </BlurView>
          </View>

          <View style={styles.viewToggleContainer}>
            <BlurView intensity={80} tint="light" style={styles.viewToggle}>
              <Pressable
                style={[
                  styles.viewButton,
                  selectedView === 'contacts' && styles.viewButtonActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedView('contacts');
                }}
              >
                {selectedView === 'contacts' && (
                  <LinearGradient
                    colors={['#6366F1', '#4F46E5']}
                    style={styles.viewButtonGradient}
                  />
                )}
                <User
                  size={18}
                  color={selectedView === 'contacts' ? '#FFFFFF' : '#6B7280'}
                  style={{ zIndex: 1 }}
                />
                <Text
                  style={[
                    styles.viewButtonText,
                    selectedView === 'contacts' && styles.viewButtonTextActive,
                  ]}
                >
                  אנשי קשר ({contacts.length})
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.viewButton,
                  selectedView === 'groups' && styles.viewButtonActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedView('groups');
                }}
              >
                {selectedView === 'groups' && (
                  <LinearGradient
                    colors={['#6366F1', '#4F46E5']}
                    style={styles.viewButtonGradient}
                  />
                )}
                <Users
                  size={18}
                  color={selectedView === 'groups' ? '#FFFFFF' : '#6B7280'}
                  style={{ zIndex: 1 }}
                />
                <Text
                  style={[
                    styles.viewButtonText,
                    selectedView === 'groups' && styles.viewButtonTextActive,
                  ]}
                >
                  קבוצות ({groups.length})
                </Text>
              </Pressable>
            </BlurView>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
            showsVerticalScrollIndicator={false}
          >
            {selectedView === 'contacts' ? (
              filteredContacts.length === 0 ? (
                <View style={styles.emptyState}>
                  <User size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>
                    {searchQuery ? 'לא נמצאו אנשי קשר' : 'אין אנשי קשר'}
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    {searchQuery ? 'נסה חיפוש אחר' : 'הוסף אנשי קשר כדי להתחיל'}
                  </Text>
                </View>
              ) : (
                filteredContacts.map((contact, index) => (
                  <MotiView
                    key={contact.id}
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: index * 50 }}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.contactCard,
                        pressed && styles.contactCardPressed,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <View style={styles.contactAvatar}>
                        <LinearGradient
                          colors={['#6366F1', '#4F46E5']}
                          style={styles.avatarGradient}
                        >
                          <Text style={styles.avatarText}>
                            {contact.name.charAt(0)}
                          </Text>
                        </LinearGradient>
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{contact.name}</Text>
                        <View style={styles.contactDetailsRow}>
                          <Text style={styles.contactDetail}>{contact.phone}</Text>
                          <Phone size={14} color="#9CA3AF" />
                        </View>
                        {contact.email && (
                          <View style={styles.contactDetailsRow}>
                            <Text style={styles.contactDetail}>{contact.email}</Text>
                            <Mail size={14} color="#9CA3AF" />
                          </View>
                        )}
                      </View>
                    </Pressable>
                  </MotiView>
                ))
              )
            ) : (
              filteredGroups.length === 0 ? (
                <View style={styles.emptyState}>
                  <Users size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>
                    {searchQuery ? 'לא נמצאו קבוצות' : 'אין קבוצות'}
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    {searchQuery ? 'נסה חיפוש אחר' : 'צור קבוצה כדי להתחיל'}
                  </Text>
                </View>
              ) : (
                filteredGroups.map((group, index) => (
                  <MotiView
                    key={group.id}
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: index * 50 }}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.groupCard,
                        pressed && styles.contactCardPressed,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <View style={styles.groupIcon}>
                        <LinearGradient
                          colors={['#10B981', '#059669']}
                          style={styles.groupIconGradient}
                        >
                          <Users size={24} color="#FFFFFF" />
                        </LinearGradient>
                      </View>
                      <View style={styles.groupInfo}>
                        <Text style={styles.groupName}>{group.name}</Text>
                        <Text style={styles.groupMembers}>
                          {group.contactIds.length} אנשי קשר
                        </Text>
                      </View>
                    </Pressable>
                  </MotiView>
                ))
              )
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
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
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBlur: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    textAlign: 'right',
  },
  viewToggleContainer: {
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: 'row-reverse',
    borderRadius: 16,
    padding: 4,
    gap: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
    position: 'relative',
  },
  viewButtonActive: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  viewButtonGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    zIndex: 1,
  },
  viewButtonTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  contactCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  contactCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactDetailsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  contactDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  groupCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  groupIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  groupIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupInfo: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  groupMembers: {
    fontSize: 14,
    color: '#6B7280',
  },
});
