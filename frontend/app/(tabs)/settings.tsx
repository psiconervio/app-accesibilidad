import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Bell,
  Moon,
  Globe,
  Type,
  Volume2,
  Vibrate,
  Shield,
  CircleHelp as HelpCircle,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SettingsItem } from '@/components/SettingsItem';
import { SectionHeader } from '@/components/SectionHeader';

export default function SettingsScreen() {
  const colors = useThemeColors();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']}>
        <View style={styles.screenHeader}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>
            Ajustes
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <TouchableOpacity
          style={[styles.profileCard, { backgroundColor: colors.surface }]}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Ver perfil de usuario"
        >
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.primary + '18' },
            ]}
          >
            <User size={32} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              Usuario
            </Text>
            <Text
              style={[
                styles.profileEmail,
                { color: colors.textSecondary },
              ]}
            >
              Configura tu cuenta
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* Accessibility */}
        <SectionHeader title="Accesibilidad" style={styles.sectionSpacing} />
        <SettingsItem
          icon={<Type size={20} color={colors.primary} />}
          title="Texto grande"
          subtitle="Aumentar tamaño de fuente"
          value={largeText}
          onToggle={setLargeText}
        />
        <SettingsItem
          icon={<Volume2 size={20} color={colors.success} />}
          title="Lector de pantalla"
          subtitle="Narración de contenido"
          value={screenReader}
          onToggle={setScreenReader}
        />
        <SettingsItem
          icon={<Vibrate size={20} color={colors.secondary} />}
          title="Retroalimentación háptica"
          subtitle="Vibración al interactuar"
          value={hapticFeedback}
          onToggle={setHapticFeedback}
        />
        <SettingsItem
          icon={<Moon size={20} color={colors.warning} />}
          title="Alto contraste"
          subtitle="Mejorar legibilidad"
          value={highContrast}
          onToggle={setHighContrast}
        />

        {/* General */}
        <SectionHeader title="General" style={styles.sectionSpacing} />
        <SettingsItem
          icon={<Bell size={20} color={colors.info} />}
          title="Notificaciones"
          subtitle="Alertas y recordatorios"
          value={notifications}
          onToggle={setNotifications}
        />
        <SettingsItem
          icon={<Moon size={20} color={colors.textSecondary} />}
          title="Modo oscuro"
          subtitle="Tema de la aplicación"
          value={darkMode}
          onToggle={setDarkMode}
        />

        {/* Info Links */}
        <SectionHeader title="Información" style={styles.sectionSpacing} />

        <TouchableOpacity
          style={[styles.linkItem, { backgroundColor: colors.surface }]}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Globe size={20} color={colors.textSecondary} />
          <Text style={[styles.linkText, { color: colors.text }]}>
            Idioma
          </Text>
          <Text style={[styles.linkValue, { color: colors.textTertiary }]}>
            Español
          </Text>
          <ChevronRight size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkItem, { backgroundColor: colors.surface }]}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Shield size={20} color={colors.textSecondary} />
          <Text style={[styles.linkText, { color: colors.text }]}>
            Privacidad
          </Text>
          <ChevronRight size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkItem, { backgroundColor: colors.surface }]}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <HelpCircle size={20} color={colors.textSecondary} />
          <Text style={[styles.linkText, { color: colors.text }]}>
            Ayuda y soporte
          </Text>
          <ChevronRight size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkItem, { backgroundColor: colors.surface }]}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Info size={20} color={colors.textSecondary} />
          <Text style={[styles.linkText, { color: colors.text }]}>
            Acerca de
          </Text>
          <Text style={[styles.linkValue, { color: colors.textTertiary }]}>
            v1.0.0
          </Text>
          <ChevronRight size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            App Accesibilidad v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Hecho con ♥ para todos
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 12,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // Profile
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  sectionSpacing: {
    marginTop: 28,
  },
  // Link items
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    gap: 14,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  linkValue: {
    fontSize: 14,
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
  },
});
