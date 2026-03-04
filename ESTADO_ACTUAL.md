# Estado Actual del Proyecto — app-accesibilidad

> Última actualización: 4 de marzo de 2026

---

## Estructura del Monorepo

```
app-accesibilidad/
├── frontend/                         # App móvil (Expo + React Native)
│   ├── app/                          # Rutas (file-based routing)
│   │   ├── _layout.tsx               # Layout raíz (Stack navigator)
│   │   ├── +not-found.tsx            # Pantalla 404
│   │   └── (tabs)/                   # Navegación por tabs
│   │       ├── _layout.tsx           # Configuración de tabs (4 tabs)
│   │       ├── index.tsx             # Tab: Inicio
│   │       ├── tools.tsx             # Tab: Herramientas
│   │       ├── camera.tsx            # Tab: Cámara
│   │       └── settings.tsx          # Tab: Ajustes
│   ├── components/                   # Componentes reutilizables
│   │   ├── FeatureCard.tsx           # Tarjeta de categoría (Visión, Audición, etc.)
│   │   ├── QuickActionButton.tsx     # Botón circular de acceso rápido
│   │   ├── SectionHeader.tsx         # Título + subtítulo de sección
│   │   ├── SettingsItem.tsx          # Fila de ajuste con toggle Switch
│   │   └── ToolListItem.tsx          # Fila de herramienta con chevron
│   ├── constants/
│   │   └── Colors.ts                 # Paleta completa light/dark
│   ├── hooks/
│   │   ├── useFrameworkReady.ts      # Señalización para Bolt.new
│   │   ├── useThemeColors.ts         # Hook de tema (light/dark automático)
│   │   ├── useAssistance.ts          # Hook para llamar POST /assistance/guide
│   │   └── useBackendStatus.ts       # Hook para verificar conexión al backend
│   ├── services/
│   │   └── api.ts                    # Cliente HTTP — fetch wrapper + tipos
│   ├── assets/images/                # icon.png, favicon.png
│   ├── app.json                      # Configuración Expo
│   ├── package.json                  # Dependencias frontend
│   └── tsconfig.json                 # TypeScript strict
│
└── backend/
    └── elder-assistant-backend/      # API REST (NestJS)
        ├── src/
        │   ├── main.ts               # Bootstrap (puerto 3000, CORS habilitado)
        │   ├── app.module.ts          # Módulo raíz (importa AssistanceModule)
        │   ├── ai/
        │   │   ├── ai.module.ts       # Módulo AI
        │   │   └── ai.service.ts      # Lógica de generación de instrucciones
        │   └── assistance/
        │       ├── assistance.module.ts
        │       ├── assistance.controller.ts  # POST /assistance/guide
        │       ├── assistance.service.ts     # Orquesta Prisma + AI
        │       └── dto/
        │           └── guide.dto.ts          # Validación: { mode, screenTexts }
        ├── prisma/
        │   ├── schema.prisma          # Modelo Session (PostgreSQL)
        │   └── prisma.service.ts      # PrismaClient wrapper
        ├── .env                       # DATABASE_URL (PostgreSQL local)
        ├── package.json               # Dependencias backend
        └── tsconfig.json
```

---

## Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| Expo SDK | 54.0.10 | Framework móvil |
| React Native | 0.81.4 | UI nativa |
| React | 19.1.0 | Core |
| TypeScript | 5.9.2 | Tipado estricto |
| expo-router | 6.0.8 | File-based routing |
| expo-camera | 17.0.8 | Acceso a cámara |
| lucide-react-native | 0.544.0 | Iconos |
| react-native-reanimated | 4.1.1 | Animaciones |
| react-native-gesture-handler | 2.28.0 | Gestos |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| NestJS | 11 | Framework API |
| Prisma | 6.9 | ORM |
| PostgreSQL | - | Base de datos |
| class-validator | - | Validación de DTOs |

---

## Endpoints del Backend

| Método | Ruta | Body | Respuesta | Descripción |
|---|---|---|---|---|
| `POST` | `/assistance/guide` | `{ mode: string, screenTexts: string[] }` | `{ sessionId: string, instruction: string }` | Genera instrucción de accesibilidad |

### Modos reconocidos actualmente
- `transfer_assist` — Busca botones de transferencia en los textos

Cualquier otro modo devuelve: `"Modo no reconocido."`

---

## Pantallas del Frontend

### 1. Inicio (`index.tsx`)
- Header con gradiente y saludo "Bienvenido"
- Banner de estado de conexión al backend (conectado / desconectado / cargando)
- 5 botones de acceso rápido: Lector, Texto, Escanear, Audio, Vibración
- 4 tarjetas de categoría: Visión, Audición, Motor, Cognitivo
- Banner informativo "¿Sabías que...?"

### 2. Herramientas (`tools.tsx`)
- Buscador de herramientas en tiempo real
- 12 herramientas organizadas por categoría:
  - **Visión** (4): Lupa digital, Alto contraste, Lector de pantalla, Tamaño de texto
  - **Audición** (3): Subtítulos en vivo, Alertas visuales, Amplificador de sonido
  - **Motor** (3): Control por voz, Retroalimentación háptica, Gestos adaptados
  - **Cognitivo** (2): Lectura fácil, Reconocimiento de texto
- Al tocar una herramienta → Modal bottom-sheet que llama al backend y muestra la instrucción

### 3. Cámara (`camera.tsx`)
- Solicitud de permisos con pantalla descriptiva
- Vista de cámara con guía visual (marco de esquinas)
- Controles: Flash, Capturar, Escanear, Voltear cámara
- **Sin funcionalidad real de captura/OCR** (los botones no tienen lógica)

### 4. Ajustes (`settings.tsx`)
- Tarjeta de perfil (sin autenticación)
- Toggles de accesibilidad: Texto grande, Lector de pantalla, Háptica, Alto contraste
- Toggles generales: Notificaciones, Modo oscuro
- Links: Idioma, Privacidad, Ayuda, Acerca de
- **Los toggles no persisten ni aplican cambios reales**

---

## Conexión Frontend ↔ Backend

```
Frontend (Expo)                    Backend (NestJS)
─────────────────                  ──────────────────
services/api.ts ──── fetch ────→  POST /assistance/guide
                                        │
hooks/useAssistance.ts                  ├→ AiService.generateInstruction()
hooks/useBackendStatus.ts               └→ PrismaService → Session (DB)
```

- **URL base**: Detectada automáticamente:
  - Android emulador → `http://10.0.2.2:3000`
  - iOS/Web → `http://localhost:3000`
  - Producción → configurable
- **CORS**: Habilitado con `origin: '*'`

---

## Accesibilidad (a11y) de la UI

| Propiedad | Cobertura |
|---|---|
| `accessibilityRole` | ✅ Todos los botones/switches |
| `accessibilityLabel` | ✅ En español, descriptivos |
| `accessibilityState` | ✅ En switches (checked) |
| `tabBarAccessibilityLabel` | ✅ En cada tab |

---

## Lo que NO está implementado

| Feature | Estado | Notas |
|---|---|---|
| Leer contenido de otras apps | ❌ | Requiere AccessibilityService nativo |
| Detectar app en primer plano | ❌ | Requiere AccessibilityService nativo |
| OCR (extraer texto de cámara) | ❌ | Falta librería ML/OCR |
| Text-to-Speech (TTS) | ❌ | Para narrar instrucciones |
| Persistencia de ajustes | ❌ | Los toggles se pierden al cerrar |
| Autenticación de usuario | ❌ | Sin flujo de login |
| Más modos en el backend AI | ❌ | Solo reconoce `transfer_assist` |
| Overlay sobre otras apps | ❌ | Requiere permiso SYSTEM_ALERT_WINDOW |
| Tests | ❌ | Sin unit ni e2e tests |
| CI/CD | ❌ | Sin pipelines |

---

## Scripts

### Frontend
```bash
cd frontend
npm run dev          # Inicia Expo (Metro bundler)
npm run build:web    # Exporta para web
npm run lint         # Linter
npm run typecheck    # Verificación de tipos
```

### Backend
```bash
cd backend/elder-assistant-backend
npm run start:dev    # NestJS en modo watch
npx prisma db push   # Sincronizar schema con DB
npx prisma studio    # UI para explorar datos
```
