# Roadmap de Features — app-accesibilidad

> Guía técnica para implementar las funcionalidades pendientes.
> Última actualización: 4 de marzo de 2026

---

## Índice

1. [AccessibilityService — Leer pantalla de otras apps](#1-accessibilityservice--leer-pantalla-de-otras-apps)
2. [OCR — Reconocimiento de texto con cámara](#2-ocr--reconocimiento-de-texto-con-cámara)
3. [Text-to-Speech (TTS) — Narrar instrucciones](#3-text-to-speech-tts--narrar-instrucciones)
4. [Persistencia de ajustes](#4-persistencia-de-ajustes)
5. [Más modos en el backend AI](#5-más-modos-en-el-backend-ai)
6. [Overlay flotante sobre otras apps](#6-overlay-flotante-sobre-otras-apps)
7. [Autenticación de usuario](#7-autenticación-de-usuario)

---

## 1. AccessibilityService — Leer pantalla de otras apps

### ¿Qué es?
Un servicio nativo de Android que permite a tu app **leer el contenido visible de cualquier aplicación** y **saber qué app está en primer plano**. Es la pieza central para la funcionalidad de asistencia.

### ¿Qué obtienes?
- `packageName` → identifica la app activa (ej: `com.whatsapp`, `com.bancolombia.app`)
- `AccessibilityNodeInfo` → árbol de nodos con textos, botones, labels de toda la pantalla

### Flujo esperado
```
Usuario abre otra app (ej: banco)
        ↓
AccessibilityService captura en segundo plano:
  • packageName: "com.banco.app"
  • screenTexts: ["Transferir", "Saldo: $500", "Enviar dinero"]
        ↓
El servicio envía datos al frontend vía evento
        ↓
Frontend llama: POST /assistance/guide
  { mode: "com.banco.app", screenTexts: [...] }
        ↓
Backend analiza y responde con instrucciones
        ↓
App muestra overlay o reproduce instrucción por voz
```

### Prerrequisito: Dejar Expo Go

Expo Go **no soporta** código nativo personalizado. Necesitas hacer **prebuild**:

```bash
cd frontend
npx expo prebuild --platform android
```

Esto genera la carpeta `android/` con el proyecto nativo. A partir de aquí usas un **development build**:

```bash
npx expo run:android
```

### Paso a paso

#### 1.1 Crear el módulo nativo (Expo Modules)

```bash
cd frontend
npx create-expo-module@latest modules/accessibility-reader
```

Esto crea un módulo local en `frontend/modules/accessibility-reader/`.

#### 1.2 Escribir el AccessibilityService en Kotlin

Crear archivo: `modules/accessibility-reader/android/src/main/java/expo/modules/accessibilityreader/ScreenReaderService.kt`

```kotlin
package expo.modules.accessibilityreader

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class ScreenReaderService : AccessibilityService() {

    companion object {
        var instance: ScreenReaderService? = null
        var lastPackageName: String = ""
        var lastScreenTexts: List<String> = emptyList()
    }

    override fun onServiceConnected() {
        instance = this
        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED or
                         AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS or
                    AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS
            notificationTimeout = 300
        }
        serviceInfo = info
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event ?: return

        val pkg = event.packageName?.toString() ?: return
        lastPackageName = pkg

        val rootNode = rootInActiveWindow ?: return
        val texts = mutableListOf<String>()
        extractTexts(rootNode, texts)
        lastScreenTexts = texts

        rootNode.recycle()
    }

    private fun extractTexts(node: AccessibilityNodeInfo, texts: MutableList<String>) {
        node.text?.let { text ->
            val t = text.toString().trim()
            if (t.isNotEmpty()) texts.add(t)
        }
        node.contentDescription?.let { desc ->
            val d = desc.toString().trim()
            if (d.isNotEmpty()) texts.add(d)
        }
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            extractTexts(child, texts)
            child.recycle()
        }
    }

    override fun onInterrupt() {
        instance = null
    }

    override fun onDestroy() {
        instance = null
        super.onDestroy()
    }
}
```

#### 1.3 Configurar AndroidManifest.xml

En `android/app/src/main/AndroidManifest.xml`, dentro de `<application>`:

```xml
<service
    android:name="expo.modules.accessibilityreader.ScreenReaderService"
    android:label="Asistente de Accesibilidad"
    android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
    android:exported="false">
    <intent-filter>
        <action android:name="android.accessibilityservice.AccessibilityService" />
    </intent-filter>
    <meta-data
        android:name="android.accessibilityservice"
        android:resource="@xml/accessibility_service_config" />
</service>
```

Crear `android/app/src/main/res/xml/accessibility_service_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowContentChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagIncludeNotImportantViews|flagReportViewIds"
    android:canRetrieveWindowContent="true"
    android:notificationTimeout="300"
    android:description="@string/accessibility_service_description" />
```

En `android/app/src/main/res/values/strings.xml`:
```xml
<string name="accessibility_service_description">
    Este servicio permite a la app leer el contenido de la pantalla
    para brindarte asistencia paso a paso.
</string>
```

#### 1.4 Exponer a JavaScript con Expo Module

En el archivo principal del módulo:

```kotlin
// modules/accessibility-reader/android/src/main/java/.../AccessibilityReaderModule.kt
package expo.modules.accessibilityreader

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.Intent
import android.provider.Settings

class AccessibilityReaderModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("AccessibilityReader")

        // Verificar si el servicio está activo
        Function("isServiceEnabled") {
            ScreenReaderService.instance != null
        }

        // Abrir ajustes de accesibilidad del sistema
        Function("openAccessibilitySettings") {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            appContext.reactContext?.startActivity(intent)
        }

        // Obtener datos capturados
        Function("getScreenData") {
            mapOf(
                "packageName" to ScreenReaderService.lastPackageName,
                "screenTexts" to ScreenReaderService.lastScreenTexts
            )
        }
    }
}
```

#### 1.5 Usar en el frontend (TypeScript)

```typescript
// frontend/hooks/useScreenReader.ts
import { useState, useEffect, useCallback } from 'react';
import { NativeModulesProxy } from 'expo-modules-core';

const AccessibilityReader = NativeModulesProxy.AccessibilityReader;

interface ScreenData {
  packageName: string;
  screenTexts: string[];
}

export function useScreenReader() {
  const [enabled, setEnabled] = useState(false);
  const [screenData, setScreenData] = useState<ScreenData | null>(null);

  const checkService = useCallback(async () => {
    const isEnabled = await AccessibilityReader.isServiceEnabled();
    setEnabled(isEnabled);
  }, []);

  const openSettings = useCallback(async () => {
    await AccessibilityReader.openAccessibilitySettings();
  }, []);

  const readScreen = useCallback(async () => {
    const data = await AccessibilityReader.getScreenData();
    setScreenData(data);
    return data;
  }, []);

  useEffect(() => {
    checkService();
  }, [checkService]);

  return { enabled, screenData, checkService, openSettings, readScreen };
}
```

#### 1.6 Activación del usuario

El usuario debe activar manualmente el servicio:
1. La app detecta que el servicio no está activo (`isServiceEnabled() === false`)
2. Muestra pantalla explicativa con botón "Activar servicio"
3. El botón llama a `openAccessibilitySettings()` → se abre la configuración del sistema
4. El usuario busca "Asistente de Accesibilidad" y lo activa

> **Importante:** Google Play tiene políticas estrictas sobre AccessibilityService. Solo se permite si la app está diseñada específicamente para personas con discapacidad (tu caso aplica).

---

## 2. OCR — Reconocimiento de texto con cámara

### Opción A: ML Kit (recomendado)

```bash
cd frontend
npm install @react-native-ml-kit/text-recognition
```

En `camera.tsx`, agregar la función de captura + OCR:

```typescript
import TextRecognition from '@react-native-ml-kit/text-recognition';

const handleScan = async () => {
  if (!cameraRef.current) return;

  // Capturar foto
  const photo = await cameraRef.current.takePictureAsync({
    quality: 0.8,
    base64: false,
  });

  // Extraer texto
  const result = await TextRecognition.recognize(photo.uri);

  // result.text contiene todo el texto reconocido
  // result.blocks contiene bloques con posición y confianza

  // Enviar al backend
  const texts = result.blocks.map(block => block.text);
  const guide = await api.getGuide({
    mode: 'ocr_scan',
    screenTexts: texts,
  });
};
```

### Opción B: Google Cloud Vision (más preciso, requiere API key)

Enviar la imagen al backend y procesarla ahí con la API de Google Cloud Vision o Tesseract.

---

## 3. Text-to-Speech (TTS) — Narrar instrucciones

Expo tiene `expo-speech`:

```bash
npx expo install expo-speech
```

Uso:

```typescript
import * as Speech from 'expo-speech';

// Narrar una instrucción
Speech.speak(response.instruction, {
  language: 'es-MX',
  rate: 0.9,        // Velocidad (más lento para mejor comprensión)
  pitch: 1.0,
});

// Detener narración
Speech.stop();

// Verificar si está hablando
const isSpeaking = await Speech.isSpeakingAsync();
```

### Dónde integrarlo
- En `tools.tsx` → cuando el backend responde con una instrucción, narrarla automáticamente
- En `camera.tsx` → después del OCR, leer el texto reconocido
- En la pantalla de asistencia del AccessibilityService → narrar cada instrucción

---

## 4. Persistencia de ajustes

### Opción: AsyncStorage

```bash
npx expo install @react-native-async-storage/async-storage
```

Crear un contexto de ajustes:

```typescript
// frontend/contexts/SettingsContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  largeText: boolean;
  screenReader: boolean;
  hapticFeedback: boolean;
  highContrast: boolean;
  darkMode: boolean;
  notifications: boolean;
}

const defaults: Settings = {
  largeText: false,
  screenReader: false,
  hapticFeedback: true,
  highContrast: false,
  darkMode: false,
  notifications: true,
};

const SettingsContext = createContext<{
  settings: Settings;
  update: (key: keyof Settings, value: boolean) => void;
}>({ settings: defaults, update: () => {} });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState<Settings>(defaults);

  useEffect(() => {
    AsyncStorage.getItem('settings').then(stored => {
      if (stored) setSettings(JSON.parse(stored));
    });
  }, []);

  const update = (key: keyof Settings, value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    AsyncStorage.setItem('settings', JSON.stringify(next));
  };

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
```

Envolver la app en `app/_layout.tsx`:
```tsx
<SettingsProvider>
  <Stack>...</Stack>
</SettingsProvider>
```

---

## 5. Más modos en el backend AI

Actualmente `AiService.generateInstruction()` solo responde a `transfer_assist`. Hay que expandirlo.

### Opción A: Reglas por app (rápido, sin IA)

```typescript
// backend: ai.service.ts
generateInstruction(mode: string, screenTexts: string[]): string {
  const textsLower = screenTexts.map(t => t.toLowerCase());
  const joined = textsLower.join(' ');

  // Detectar por packageName
  switch (mode) {
    case 'com.whatsapp':
      if (joined.includes('enviar')) return 'Toca el botón Enviar para mandar el mensaje.';
      if (joined.includes('llamar')) return 'Toca el ícono de teléfono para llamar.';
      return 'Estás en WhatsApp. ¿Qué deseas hacer?';

    case 'com.bancolombia.app':
      if (joined.includes('transferir')) return 'Toca Transferir para enviar dinero.';
      if (joined.includes('saldo')) return 'Tu saldo se muestra en la pantalla.';
      return 'Estás en la app del banco. Busco los botones disponibles...';

    case 'ocr_scan':
      return `Texto detectado: ${screenTexts.join(', ')}`;

    default:
      return `Estás en ${mode}. Textos encontrados: ${screenTexts.slice(0, 5).join(', ')}`;
  }
}
```

### Opción B: Integrar un LLM (más inteligente)

Instalar el SDK de OpenAI en el backend:

```bash
cd backend/elder-assistant-backend
npm install openai
```

```typescript
// backend: ai.service.ts
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async generateInstruction(mode: string, screenTexts: string[]): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente de accesibilidad para personas mayores.
                    El usuario tiene abierta la app "${mode}".
                    Analiza los textos visibles y da UNA instrucción clara,
                    simple y corta sobre qué botón tocar o qué acción tomar.
                    Responde siempre en español.`
        },
        {
          role: 'user',
          content: `Textos en pantalla: ${JSON.stringify(screenTexts)}`
        }
      ],
      max_tokens: 150,
    });

    return response.choices[0].message.content ?? 'No pude generar una instrucción.';
  }
}
```

> **Nota:** Si usas LLM, el método pasa a ser `async` y hay que actualizar `AssistanceService.guide()` con `await`.

---

## 6. Overlay flotante sobre otras apps

Para mostrar instrucciones encima de cualquier app (como un burbujas de chat), necesitas:

### Permiso
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
```

### Solicitar permiso en runtime
```kotlin
if (!Settings.canDrawOverlays(context)) {
    val intent = Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:${context.packageName}")
    )
    startActivity(intent)
}
```

### Implementación
Crear una `View` flotante usando `WindowManager` en Kotlin que muestre las instrucciones del backend. Esto se maneja completamente desde el módulo nativo, no desde React Native.

Alternativa más sencilla: usar **notificaciones persistentes** que muestren la instrucción actual.

---

## 7. Autenticación de usuario

### Opción simple: JWT con NestJS

**Backend:**
```bash
cd backend/elder-assistant-backend
npm install @nestjs/jwt @nestjs/passport passport passport-local bcrypt
```

Crear módulos `auth/` y `users/` en el backend con:
- `POST /auth/register` → crear usuario
- `POST /auth/login` → devolver JWT
- Guard `JwtAuthGuard` para proteger endpoints

**Frontend:**
- Guardar token en `AsyncStorage`
- Enviarlo como `Authorization: Bearer <token>` en cada request
- Crear pantallas `login.tsx` y `register.tsx` fuera del grupo `(tabs)`

---

## Orden de implementación sugerido

```
Fase 1 — Funcionalidad básica                   Prioridad
─────────────────────────────────────────────────────────
1. Persistencia de ajustes (AsyncStorage)         ⬛⬛⬛⬜⬜
2. Text-to-Speech (expo-speech)                   ⬛⬛⬛⬜⬜
3. OCR con ML Kit en cámara                       ⬛⬛⬛⬛⬜
4. Más modos en backend (reglas por app)          ⬛⬛⬛⬜⬜

Fase 2 — Funcionalidad avanzada (requiere prebuild)
─────────────────────────────────────────────────────────
5. npx expo prebuild                              ⬛⬛⬛⬛⬛
6. AccessibilityService nativo                    ⬛⬛⬛⬛⬛
7. Overlay flotante                               ⬛⬛⬛⬛⬜

Fase 3 — Mejoras
─────────────────────────────────────────────────────────
8. Autenticación JWT                              ⬛⬛⬛⬜⬜
9. Integrar LLM (OpenAI) en backend               ⬛⬛⬛⬛⬜
10. Tests + CI/CD                                  ⬛⬛⬜⬜⬜
```

---

## Notas importantes

1. **Expo Go vs Development Build**: Las features 5-7 requieren salir de Expo Go. El comando `npx expo prebuild` genera `android/` y `ios/`. A partir de ahí se usa `npx expo run:android`.

2. **Google Play y AccessibilityService**: Google exige que las apps que usan este permiso estén diseñadas para personas con discapacidad y lo justifiquen. Tu app califica, pero deberás completar un formulario especial al publicar.

3. **Privacidad**: El AccessibilityService lee TODO lo que está en pantalla (incluyendo contraseñas, mensajes, etc.). Implementa:
   - Cifrado de datos en tránsito (HTTPS)
   - No almacenar textos sensibles en la BD
   - Política de privacidad clara

4. **LLM vs Reglas**: Empieza con reglas estáticas por app para moverte rápido. Integra un LLM cuando las reglas se queden cortas o necesites soportar apps desconocidas.
