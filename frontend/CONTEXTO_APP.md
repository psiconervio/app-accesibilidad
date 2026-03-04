# Contexto de la Aplicación — app-accesibilidad

## Información General

| Campo              | Valor                          |
|--------------------|--------------------------------|
| **Nombre**         | bolt-expo-nativewind            |
| **Versión**        | 1.0.0                          |
| **Repositorio**    | psiconervio/app-accesibilidad  |
| **Rama principal** | main                           |
| **Template**       | bolt-expo (Bolt.new)           |
| **Plataforma**     | React Native (Expo SDK 54)     |
| **Lenguaje**       | TypeScript (strict mode)       |

---

## Descripción

Aplicación móvil de **accesibilidad** construida con **Expo** y **React Native**. El proyecto fue inicializado a partir del template `bolt-expo` de Bolt.new. Actualmente se encuentra en una etapa inicial (scaffold), con la estructura base de navegación configurada pero sin pantallas funcionales implementadas.

---

## Stack Tecnológico

### Core
- **React** 19.1.0
- **React Native** 0.81.4
- **Expo** ~54.0.10
- **TypeScript** ~5.9.2 (strict)

### Navegación
- **expo-router** ~6.0.8 — enrutamiento basado en archivos (file-based routing)
- **@react-navigation/native** ^7.0.14
- **@react-navigation/bottom-tabs** ^7.2.0
- **react-native-screens** ~4.16.0

### UI / Estilos
- **lucide-react-native** ^0.544.0 — librería de íconos
- **@lucide/lab** ^0.1.2 — íconos experimentales
- **@expo/vector-icons** ^15.0.2
- **expo-blur** ~15.0.7
- **expo-linear-gradient** ~15.0.7
- **react-native-svg** 15.12.1

### Animaciones / Gestos
- **react-native-reanimated** ~4.1.1
- **react-native-gesture-handler** ~2.28.0

### Backend / BaaS
- **@supabase/supabase-js** ^2.58.0 — cliente de Supabase (autenticación, base de datos, etc.)
- **react-native-url-polyfill** ^2.0.0 — polyfill necesario para Supabase en React Native

### Funcionalidades Nativas
- **expo-camera** ~17.0.8 — acceso a la cámara del dispositivo
- **expo-haptics** ~15.0.7 — retroalimentación háptica
- **expo-web-browser** ~15.0.7 — abrir enlaces en el navegador del sistema
- **expo-linking** ~8.0.8 — deep linking

### Web
- **react-dom** 19.1.0
- **react-native-web** ^0.21.0
- **react-native-webview** 13.15.0

### Herramientas de Desarrollo
- **@babel/core** ^7.25.2
- **Prettier** (configurado con `.prettierrc`)

---

## Estructura de Carpetas

```
app-accesibilidad/
├── front/                          # Proyecto Expo (frontend)
│   ├── .bolt/
│   │   └── config.json             # Configuración Bolt (template: bolt-expo)
│   ├── .expo/                      # Caché y tipos generados por Expo
│   ├── app/                        # Directorio de rutas (expo-router)
│   │   ├── _layout.tsx             # Layout raíz (Stack navigator)
│   │   └── +not-found.tsx          # Pantalla 404
│   ├── assets/
│   │   └── images/
│   │       ├── favicon.png         # Favicon para web
│   │       └── icon.png            # Ícono de la app
│   ├── hooks/
│   │   └── useFrameworkReady.ts    # Hook de señalización para Bolt.new
│   ├── .gitignore
│   ├── .prettierrc                 # Configuración de Prettier
│   ├── app.json                    # Configuración de Expo
│   ├── expo-env.d.ts               # Tipos de entorno Expo
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json               # Configuración TypeScript
```

---

## Configuración Clave

### app.json (Expo)
- **Orientación:** portrait
- **UI Style:** automatic (soporta dark/light mode)
- **New Architecture:** habilitada (`newArchEnabled: true`)
- **Typed Routes:** habilitadas (rutas tipadas con TypeScript)
- **Scheme:** `myapp` (para deep linking)
- **Plugins:** expo-router, expo-font, expo-web-browser
- **Web:** Metro bundler, output single

### tsconfig.json
- Extiende `expo/tsconfig.base`
- Modo estricto habilitado
- Path alias: `@/*` → `./*`

### Prettier
- Sin tabs (espacios)
- Tab width: 2
- Single quotes: sí
- Bracket spacing: sí

---

## Archivos Principales

### `app/_layout.tsx` — Layout Raíz
- Usa `Stack` de expo-router como navegador principal
- Headers ocultos por defecto
- Integra `StatusBar` con estilo automático
- Ejecuta el hook `useFrameworkReady()` al montarse

### `app/+not-found.tsx` — Pantalla 404
- Muestra mensaje "This screen doesn't exist."
- Incluye enlace para regresar a la pantalla principal

### `hooks/useFrameworkReady.ts`
- Hook utilitario que señaliza a Bolt.new que el framework está listo
- Llama a `window.frameworkReady?.()` en un `useEffect`

---

## Estado Actual del Proyecto

### Implementado
- ✅ Scaffold inicial con Expo SDK 54
- ✅ Navegación básica con expo-router (Stack)
- ✅ Pantalla 404 (not-found)
- ✅ Configuración de TypeScript (strict)
- ✅ Configuración de Prettier
- ✅ Dependencias instaladas (node_modules con lock file)
- ✅ Soporte para web (react-native-web)
- ✅ New Architecture habilitada

### Pendiente / No implementado
- ❌ **No hay pantalla principal (index)** — falta `app/index.tsx`
- ❌ No hay pantallas funcionales de accesibilidad
- ❌ No hay conexión configurada con Supabase (no hay archivo `.env` ni cliente inicializado)
- ❌ No hay componentes reutilizables (carpeta `components/`)
- ❌ No hay estilos globales ni tema definido
- ❌ No hay uso de la cámara (expo-camera instalado pero no integrado)
- ❌ No hay navegación por tabs (dependencia instalada pero no configurada)
- ❌ No hay tests
- ❌ No hay configuración de CI/CD

---

## Scripts Disponibles

| Script         | Comando                        | Descripción                          |
|----------------|--------------------------------|--------------------------------------|
| `dev`          | `expo start`                   | Inicia el servidor de desarrollo     |
| `build:web`    | `expo export --platform web`   | Exporta la app para web              |
| `lint`         | `expo lint`                    | Ejecuta el linter                    |
| `typecheck`    | `tsc --noEmit`                 | Verifica tipos TypeScript            |

---

## Notas Técnicas

1. **Expo SDK 54** con la **New Architecture** de React Native habilitada — esto implica soporte para Fabric (nuevo renderer) y TurboModules.
2. El proyecto usa **file-based routing** de expo-router, lo que significa que la estructura de carpetas dentro de `app/` define automáticamente las rutas.
3. **Supabase** está listado como dependencia pero no está configurado — se necesitará crear un cliente con las credenciales del proyecto.
4. El template base es de **Bolt.new**, lo que explica el hook `useFrameworkReady` y la carpeta `.bolt/`.
5. El path alias `@/` apunta a la raíz del proyecto front, permitiendo imports como `@/hooks/useFrameworkReady`.

---

*Última actualización: 3 de marzo de 2026*
