import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Eye,
  ZoomIn,
  Type,
  Palette,
  Volume2,
  Ear,
  Vibrate,
  Hand,
  BookOpen,
  MonitorSmartphone,
  Search,
  ScanLine,
  Mic,
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ToolListItem } from '@/components/ToolListItem';
import { SectionHeader } from '@/components/SectionHeader';

interface Tool {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  category: string;
}

export default function ToolsScreen() {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');

  const allTools: Tool[] = [
    // Visión
    {
      id: 'magnifier',
      icon: <ZoomIn size={22} color={colors.primary} />,
      title: 'Lupa digital',
      subtitle: 'Ampliar texto e imágenes',
      color: colors.primary,
      category: 'Visión',
    },
    {
      id: 'contrast',
      icon: <Palette size={22} color={colors.primary} />,
      title: 'Alto contraste',
      subtitle: 'Mejorar contraste de colores',
      color: colors.primary,
      category: 'Visión',
    },
    {
      id: 'text-reader',
      icon: <Eye size={22} color={colors.primary} />,
      title: 'Lector de pantalla',
      subtitle: 'Leer contenido en voz alta',
      color: colors.primary,
      category: 'Visión',
    },
    {
      id: 'font-size',
      icon: <Type size={22} color={colors.primary} />,
      title: 'Tamaño de texto',
      subtitle: 'Ajustar tipografía',
      color: colors.primary,
      category: 'Visión',
    },
    // Audición
    {
      id: 'subtitles',
      icon: <MonitorSmartphone size={22} color={colors.success} />,
      title: 'Subtítulos en vivo',
      subtitle: 'Transcripción automática',
      color: colors.success,
      category: 'Audición',
    },
    {
      id: 'sound-alerts',
      icon: <Ear size={22} color={colors.success} />,
      title: 'Alertas visuales',
      subtitle: 'Notificar sonidos con destellos',
      color: colors.success,
      category: 'Audición',
    },
    {
      id: 'volume-boost',
      icon: <Volume2 size={22} color={colors.success} />,
      title: 'Amplificador de sonido',
      subtitle: 'Mejorar audio del entorno',
      color: colors.success,
      category: 'Audición',
    },
    // Motor
    {
      id: 'voice-control',
      icon: <Mic size={22} color={colors.secondary} />,
      title: 'Control por voz',
      subtitle: 'Navegar la app con comandos',
      color: colors.secondary,
      category: 'Motor',
    },
    {
      id: 'haptic',
      icon: <Vibrate size={22} color={colors.secondary} />,
      title: 'Retroalimentación háptica',
      subtitle: 'Vibración como respuesta',
      color: colors.secondary,
      category: 'Motor',
    },
    {
      id: 'gestures',
      icon: <Hand size={22} color={colors.secondary} />,
      title: 'Gestos adaptados',
      subtitle: 'Gestos simplificados',
      color: colors.secondary,
      category: 'Motor',
    },
    // Cognitivo
    {
      id: 'easy-read',
      icon: <BookOpen size={22} color={colors.warning} />,
      title: 'Lectura fácil',
      subtitle: 'Texto simplificado',
      color: colors.warning,
      category: 'Cognitivo',
    },
    {
      id: 'ocr',
      icon: <ScanLine size={22} color={colors.warning} />,
      title: 'Reconocimiento de texto',
      subtitle: 'Extraer texto de imágenes',
      color: colors.warning,
      category: 'Cognitivo',
    },
  ];

  const filteredTools = searchQuery
    ? allTools.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allTools;

  const categories = [...new Set(filteredTools.map((t) => t.category))];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.screenHeader}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>
            Herramientas
          </Text>
          <Text
            style={[styles.screenSubtitle, { color: colors.textSecondary }]}
          >
            {allTools.length} herramientas disponibles
          </Text>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar herramienta..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Buscar herramientas de accesibilidad"
          />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <SectionHeader title={category} />
            {filteredTools
              .filter((t) => t.category === category)
              .map((tool) => (
                <ToolListItem
                  key={tool.id}
                  icon={tool.icon}
                  title={tool.title}
                  subtitle={tool.subtitle}
                  color={tool.color}
                />
              ))}
          </View>
        ))}

        {filteredTools.length === 0 && (
          <View style={styles.emptyState}>
            <Search size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No se encontraron herramientas
            </Text>
            <Text
              style={[styles.emptySubtext, { color: colors.textTertiary }]}
            >
              Intenta con otro término de búsqueda
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingHorizontal: 20,
  },
  screenHeader: {
    paddingTop: Platform.OS === 'web' ? 40 : 12,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  screenSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  categorySection: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
});
