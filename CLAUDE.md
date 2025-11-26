# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Zoom Video SDK UI Toolkit is a prebuilt video chat user interface powered by the Zoom Video SDK. It's a React-based library that provides ready-to-use components for video conferencing functionality.

**Package Distribution**: Built as both ESM and UMD modules (`videosdk-ui-toolkit.min.esm.js` and `videosdk-ui-toolkit.min.umd.js`) with accompanying CSS (`videosdk-ui-toolkit.css`).

## Development Commands

### Setup
```bash
# First time setup - create dev config from template
cp src/config/devTemplate.ts src/config/dev.ts

# Install dependencies and start dev server
npm i && npm run dev
```

### [Https](https://github.com/FiloSottile/mkcert)

## Windows

`choco install mkcert`

## Mac

`brew install mkcert`

`brew install nss` # if you use Firefox

### Generate certificate

`mkcert localhost 127.0.0.1 ::1`

### Build & Package
```bash
# Standard production build
npm run build

# Build and package as .tgz
npm run tgz

# Development with HTTPS (uses localhost+2.pem and localhost+2-key.pem)
npm run https

# Bundle analysis
npm run visualizer
```

### Testing(WIP)
```bash
# Run tests in watch mode
npm run test:unit

# Run tests once with coverage
npm run test:coverage

# CI test run
npm run test:ci
```

### Code Quality
```bash
# Lint TypeScript/React files
npm run lint

# Lint and auto-fix
npm run lint:fix

# Lint SCSS/CSS (allows up to 4000 warnings)
npm run lint:style
```

### Documentation
```bash
# Generate TypeDoc documentation
npm run docs
```

## Architecture

### State Management (Redux Toolkit)
The application uses Redux Toolkit for centralized state management. The store is configured in `src/store/store.ts` with feature-based slices:

- **session**: Session state and connection status (src/store/sessionSlice.ts)
- **ui**: UI state, view modes, popper states, layout customization (src/store/uiSlice.ts)
- **participant**: Participant management and user lists (src/features/participant/participantSlice.ts)
- **chat**: Chat messages and state (src/features/chat/chatSlice.ts)
- **setting**: Settings, devices, quality statistics (src/features/setting/settingSlice.ts)
- **caption**: Caption/translation state (src/features/caption/captionSlice.ts)
- **media**: Media stream state (src/features/media/mediaSlice.ts)
- **subsession**: Breakout room functionality (src/features/subsession/subsessionSlice.ts)
- **whiteboard**: Whiteboard state (src/features/whiteboard/whiteboardSlice.ts)

### Public API Entry Point
`src/uikit/index.tsx` exports the singleton UIToolkitAPI that consumers use. Key methods:
- `joinSession()` / `closeSession()` / `leaveSession()` - Session lifecycle
- `openPreview()` / `closePreview()` - Preview flow before joining
- `showChatComponent()` / `showUsersComponent()` / `showSettingsComponent()` - Component rendering
- `on()` / `off()` - Event listener management (proxies to Zoom Video SDK events)
- `migrateConfig()` - Converts legacy config to current format
- `getAllUser()` / `getCurrentUserInfo()` / `getSessionInfo()` - Data accessors

### UIToolkit Core Class
`src/uikit/UIToolkit.tsx` manages the React rendering lifecycle:
- Creates a singleton Zoom Video SDK client (`ZoomVideo.createClient()`)
- Manages React roots for the main app and individual components (chat, users, settings, controls)
- Enforces singleton pattern for components - only one instance of each component type can be active
- Handles cleanup on session close/destruction

### Feature Structure
Each feature in `src/features/` follows a consistent pattern:
- **Components**: React components for UI (`components/` subdirectory)
- **Slice**: Redux state management (`*Slice.ts`)
- **Hooks**: Custom React hooks for feature logic (`hooks/` subdirectory)
- **Constants**: Feature-specific constants (`*-constants.ts` or `*-constant.ts`)
- **Utils**: Helper functions (`*-utils.ts`)
- **Types**: TypeScript type definitions (`*-types.d.ts`)

Key features:
- **audio**: Microphone, speaker, phone dial-in
- **video**: Camera, video rendering, gallery/speaker view
- **share**: Screen sharing and annotation
- **chat**: In-session messaging
- **participant**: User management, host controls
- **setting**: Device selection, virtual background, quality stats
- **caption**: Live captions and translation
- **subsession**: Breakout rooms
- **recording**: Cloud recording
- **preview**: Pre-join device/background selection

### Context Providers
- **client-context.ts**: Provides Zoom Video SDK client throughout component tree
- **stream-context.ts**: Media stream context
- **session-additional-context.ts**: Additional session configuration

### Event System
`src/events/event-bus.ts` provides internal event pub/sub using the `mitt` library. Events defined in `src/events/event-constant.ts` include:
- Session lifecycle events (joined, closed, destroyed)
- Component visibility events
- Custom UI events

External SDK events are proxied through the UIToolkit's `on()`/`off()` methods.

### Build Configuration

**Vite** is used for both development and production builds (vite.config.ts):
- **Production mode**: Builds as library with UMD and ESM outputs to `distTmp/`, then copied to `videosdk-ui-toolkit/dist/`
- **Development mode**: Standard dev server with HMR
- **Path alias**: `@/` maps to `src/`
- **HTTPS support**: Requires `localhost+2.pem` and `localhost+2-key.pem` certificates
- **Special handling**: Bundles all React dependencies (not externalized) for standalone distribution

The `src/uikit/index.tsx` entry point exports the public API. PostCSS with `postcss-prefix-selector` ensures CSS isolation.

### Component Rendering Pattern
Components can be rendered in two contexts:
1. **Full app mode**: `UIToolKitApp` (src/App.tsx) renders the complete interface
2. **Individual component mode**: Specific "Kit" components (ChatKit, UsersKit, SettingsKit, ControlsKit) for custom layouts

Mobile vs. Desktop: Components adapt based on `isMobileDeviceNotIpad()` detection. Some APIs like `showChatComponent()` are not supported on mobile.

### TypeScript Configuration
- Strict mode enabled
- Path alias `@/*` resolves to `src/*`
- Targets ES2020 with module: ESNext
- React JSX transform

## Key Implementation Details

### Session Lifecycle
1. Consumer calls `UIToolkitAPI.joinSession(container, config)`
2. UIToolkit instance created with `ZoomVideo.createClient()`
3. Config is migrated to current format via `migrateConfig()`
4. React root created in container, renders `UIToolKitApp`
5. App initializes Video SDK client and joins session
6. Components subscribe to SDK events and update Redux state
7. On leave/close, components unmount, roots destroyed, session ended

### Custom Layout Support
Desktop and tablet devices can use individual component APIs:
- `showControlsComponent()` - Render toolbar separately
- `showChatComponent()` - Render chat panel separately
- `showUsersComponent()` - Render participants panel separately
- `showSettingsComponent()` - Render settings panel separately

Mobile devices must use the full integrated UI (`joinSession()` only).

### Virtual Background & Video Processing
Video processing features in `src/features/setting/components/Processors/`:
- Uses Zoom Video SDK's video processor APIs
- Virtual background images loaded from CDN or local `/image` directory
- Blur effect supported
- Device capability detection before enabling

### Important Files to Know
- `src/types/global.d.ts` and `src/types/custom.d.ts` - Core type definitions
- `src/constant/` - Application-wide constants (error codes, UI constants, stream constants)
- `src/components/util/service.ts` - Utility functions for device detection, avatar handling
- `src/hooks/` - Reusable custom hooks (useMount, useUnmount, usePrevious, useHover, etc.)
- `src/i18n/` - Internationalization setup
- `videosdk-ui-toolkit/index.d.ts` - Public TypeScript definitions for npm package

## Testing

Tests are located in `tests/unit/` and use:
- **Vitest** as test runner
- **jsdom** for DOM environment
- **React Testing Library** for component testing
- Setup file: `tests/setup/test-setup.ts`

Coverage reports generated to `./coverage/` directory.

## Package Publishing

The build process:
1. `npm run build` - Compiles TypeScript and runs Vite build to `distTmp/`
2. Copies built files from `distTmp/` to `videosdk-ui-toolkit/dist/`
3. Copies Zoom Video SDK library files from `node_modules/@zoom/videosdk/dist/lib` to output
4. `npm run pack` - Creates .tgz in `videosdk-ui-toolkit/` directory
5. Package defined in `videosdk-ui-toolkit/package.json`

## Development Tips

### Config File
Create `src/config/dev.ts` from template with your Zoom Video SDK credentials (sdkKey, sdkSecret, webEndpoint).

### Debug Mode
Set `debug: true` in config to expose the Zoom Video SDK client via `UIToolkitAPI.getClient()`.

### CORS Headers
Dev server sets `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` for SharedArrayBuffer support.

### Avoiding Breaking Changes
When modifying the public API in `src/uikit/index.tsx`, ensure backward compatibility or update version appropriately. The API is consumed by external applications.

### Feature Flag Pattern
Features can be toggled in config via `featuresOptions`:
```typescript
featuresOptions: {
  video: { enable: true },
  audio: { enable: true },
  share: { enable: true },
  chat: { enable: true },
  // ... see videosdk-ui-toolkit/index.d.ts for full list
}
```

### Styling Approach
Uses TailwindCSS (v3.4.17) with SCSS for component-specific styles. CSS is prefixed to avoid conflicts when embedded in host applications.
