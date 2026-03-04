import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera as CameraIcon,
  SwitchCamera,
  Zap,
  ZapOff,
  ScanLine,
  X,
  Focus,
} from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function CameraScreen() {
  const colors = useThemeColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Permission not determined yet
  if (!permission) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      />
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <SafeAreaView style={styles.centered}>
          <View
            style={[
              styles.permissionIcon,
              { backgroundColor: colors.warning + '18' },
            ]}
          >
            <CameraIcon size={48} color={colors.warning} />
          </View>
          <Text style={[styles.permissionTitle, { color: colors.text }]}>
            Acceso a la cámara
          </Text>
          <Text
            style={[
              styles.permissionText,
              { color: colors.textSecondary },
            ]}
          >
            Necesitamos acceso a tu cámara para las funciones de
            reconocimiento de texto, lupa digital y otras herramientas de
            accesibilidad.
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={requestPermission}
            accessibilityRole="button"
            accessibilityLabel="Permitir acceso a la cámara"
          >
            <Text style={styles.permissionButtonText}>
              Permitir cámara
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash ? 'on' : 'off'}
      >
        {/* Top bar */}
        <SafeAreaView edges={['top']}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.topButton}
              onPress={toggleFlash}
              accessibilityLabel={
                flash ? 'Desactivar flash' : 'Activar flash'
              }
              accessibilityRole="button"
            >
              {flash ? (
                <Zap size={22} color="#FFF" />
              ) : (
                <ZapOff size={22} color="#FFF" />
              )}
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>Cámara Asistida</Text>
            <View style={styles.topButton} />
          </View>
        </SafeAreaView>

        {/* Center guides */}
        <View style={styles.centerGuide}>
          <View style={styles.guideFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.guideText}>
            Apunta al texto u objeto que deseas analizar
          </Text>
        </View>

        {/* Bottom controls */}
        <SafeAreaView edges={['bottom']}>
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.actionButton}
              accessibilityLabel="Escanear texto"
              accessibilityRole="button"
            >
              <ScanLine size={24} color="#FFF" />
              <Text style={styles.actionLabel}>Escanear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              accessibilityLabel="Tomar foto"
              accessibilityRole="button"
            >
              <View style={styles.captureOuter}>
                <View style={styles.captureInner}>
                  <Focus size={28} color="#FFF" />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleFacing}
              accessibilityLabel="Cambiar cámara"
              accessibilityRole="button"
            >
              <SwitchCamera size={24} color="#FFF" />
              <Text style={styles.actionLabel}>Voltear</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  // Permission screen
  permissionIcon: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 8,
    paddingBottom: 12,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  // Center guide
  centerGuide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideFrame: {
    width: 260,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#FFF',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 12,
  },
  guideText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'web' ? 24 : 12,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
