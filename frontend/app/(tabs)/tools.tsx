import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Platform,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
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
  X,
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAssistance } from '@/hooks/useAssistance';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const { loading, error, response, requestGuide, clear } = useAssistance();

  const handleToolPress = async (tool: Tool) => {
    setSelectedTool(tool);
    setModalVisible(true);
    await requestGuide(tool.id, [tool.title, tool.subtitle]);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTool(null);
    clear();
  };

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
                  onPress={() => handleToolPress(tool)}
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

      {/* Assistance Response Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedTool?.title ?? 'Asistencia'}
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                accessibilityLabel="Cerrar"
              >
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {loading && (
              <View style={styles.modalBody}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text
                  style={[
                    styles.modalMessage,
                    { color: colors.textSecondary, marginTop: 12 },
                  ]}
                >
                  Consultando al asistente...
                </Text>
              </View>
            )}

            {error && (
              <View style={styles.modalBody}>
                <Text style={[styles.modalMessage, { color: colors.error }]}>
                  {error}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.retryButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() =>
                    selectedTool &&
                    requestGuide(selectedTool.id, [
                      selectedTool.title,
                      selectedTool.subtitle,
                    ])
                  }
                >
                  <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}

            {response && (
              <View style={styles.modalBody}>
                <View
                  style={[
                    styles.instructionCard,
                    { backgroundColor: colors.primary + '10' },
                  ]}
                >
                  <Text
                    style={[
                      styles.instructionText,
                      { color: colors.text },
                    ]}
                  >
                    {response.instruction}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.sessionId,
                    { color: colors.textTertiary },
                  ]}
                >
                  Sesión: {response.sessionId.slice(0, 8)}...
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    minHeight: 250,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalBody: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalMessage: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  instructionCard: {
    padding: 20,
    borderRadius: 16,
    width: '100%',
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  sessionId: {
    fontSize: 12,
    marginTop: 12,
  },
});
