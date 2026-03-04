import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Eye,
  Volume2,
  Type,
  ScanLine,
  Ear,
  HandMetal,
  Vibrate,
  BookOpen,
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FeatureCard } from '@/components/FeatureCard';
import { QuickActionButton } from '@/components/QuickActionButton';
import { SectionHeader } from '@/components/SectionHeader';

export default function HomeScreen() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Bienvenido 👋</Text>
                <Text style={styles.headerTitle}>Accesibilidad</Text>
                <Text style={styles.headerSubtitle}>
                  Tu asistente de accesibilidad personal
                </Text>
              </View>
              <View style={styles.headerBadge}>
                <Eye size={28} color="#FFFFFF" />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          {/* Quick Actions */}
          <SectionHeader
            title="Acceso rápido"
            subtitle="Funciones principales"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActions}
          >
            <QuickActionButton
              icon={<Volume2 size={26} color={colors.info} />}
              label="Lector"
              color={colors.info}
            />
            <QuickActionButton
              icon={<Type size={26} color={colors.secondary} />}
              label="Texto"
              color={colors.secondary}
            />
            <QuickActionButton
              icon={<ScanLine size={26} color={colors.success} />}
              label="Escanear"
              color={colors.success}
            />
            <QuickActionButton
              icon={<Ear size={26} color={colors.warning} />}
              label="Audio"
              color={colors.warning}
            />
            <QuickActionButton
              icon={<Vibrate size={26} color={colors.accent} />}
              label="Vibración"
              color={colors.accent}
            />
          </ScrollView>

          {/* Feature Cards */}
          <SectionHeader
            title="Explorar"
            subtitle="Herramientas de accesibilidad"
            style={styles.sectionSpacing}
          />

          <View style={styles.cardRow}>
            <FeatureCard
              icon={<Eye size={24} color={colors.primary} />}
              title="Visión"
              description="Lupa, contraste y lectura de texto"
              color={colors.primary}
              style={styles.cardLeft}
            />
            <FeatureCard
              icon={<Ear size={24} color={colors.success} />}
              title="Audición"
              description="Subtítulos y alertas visuales"
              color={colors.success}
              style={styles.cardRight}
            />
          </View>

          <View style={styles.cardRow}>
            <FeatureCard
              icon={<HandMetal size={24} color={colors.secondary} />}
              title="Motor"
              description="Control por voz y gestos adaptados"
              color={colors.secondary}
              style={styles.cardLeft}
            />
            <FeatureCard
              icon={<BookOpen size={24} color={colors.warning} />}
              title="Cognitivo"
              description="Lectura fácil y guías paso a paso"
              color={colors.warning}
              style={styles.cardRight}
            />
          </View>

          {/* Info Banner */}
          <View
            style={[
              styles.infoBanner,
              { backgroundColor: colors.info + '12' },
            ]}
            accessibilityRole="text"
          >
            <View style={styles.infoBannerIcon}>
              <Eye size={20} color={colors.info} />
            </View>
            <View style={styles.infoBannerText}>
              <Text style={[styles.infoBannerTitle, { color: colors.text }]}>
                ¿Sabías que...?
              </Text>
              <Text
                style={[
                  styles.infoBannerDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Más de mil millones de personas en el mundo viven con alguna
                forma de discapacidad. Esta app busca hacer la tecnología más
                accesible para todos.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 40 : 16,
  },
  greeting: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    fontWeight: '400',
  },
  headerBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  quickActions: {
    gap: 12,
    paddingRight: 20,
  },
  sectionSpacing: {
    marginTop: 28,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 16,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  infoBannerIcon: {
    marginRight: 14,
    marginTop: 2,
  },
  infoBannerText: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoBannerDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
});
