# Dreamcatcher VS Code Extension Guide

**Version:** 2.0.0
**Last Updated:** 2025-11-13
**Status:** ✅ TypeScript compilation fixed (v2.4.1)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Features](#features)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [PipelineOS Integration](#pipelineos-integration)
7. [Troubleshooting](#troubleshooting)
8. [Development](#development)
9. [Architecture](#architecture)
10. [Contributing](#contributing)

---

## Overview

The Dreamcatcher VS Code extension enables seamless capture of AI conversations directly within your development environment. It integrates with VS Code, Cursor, and other compatible editors to help you organize and manage conversations as "dreams" and "fragments."

### Key Capabilities

- **Conversation Capture**: Turn selected text or clipboard content into organized dreams
- **PipelineOS Integration**: Sync dreams with PipelineOS for AI-powered implementation
- **Tree View Navigation**: Browse and manage dreams directly in the sidebar
- **Real-time Sync**: WebSocket connection for live updates from PipelineOS
- **Local Storage**: Dreams stored locally with optional cloud sync

---

## Installation

### Prerequisites

- VS Code version 1.85.0 or higher
- Node.js 18+ (for development)

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dreamcatcher.git
   cd dreamcatcher/extensions/vscode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile TypeScript**
   ```bash
   npm run compile
   ```

4. **Open in VS Code**
   ```bash
   code .
   ```

5. **Launch Extension Development Host**
   - Press `F5` to open a new VS Code window with the extension loaded
   - Or use "Run > Start Debugging" from the menu

### From VSIX Package (Coming Soon)

```bash
code --install-extension dreamcatcher-2.0.0.vsix
```

---

## Features

### 1. Conversation Capture

Capture AI conversations from various sources:

#### From Selected Text
1. Select text in any editor
2. Right-click → "Dreamcatcher: Capture Selection"
3. Or use command palette: `Cmd/Ctrl+Shift+P` → "Dreamcatcher: Capture Conversation"

#### From Clipboard
1. Copy conversation text to clipboard
2. Open command palette: `Cmd/Ctrl+Shift+P`
3. Run "Dreamcatcher: Capture from Clipboard"

#### Automatic Parsing
The extension automatically extracts:
- **Title**: First meaningful line or AI-detected title
- **Tags**: Keywords and project names
- **Entities**: People, projects, and technologies mentioned
- **Metadata**: Timestamps, source information

### 2. Dream Management

#### Tree View
- Access via Activity Bar (Dreamcatcher icon)
- Expandable dream hierarchy:
  ```
  📁 All Dreams
  ├── 💡 Dream 1 (3 fragments)
  │   ├── 📄 Fragment 1
  │   ├── 📄 Fragment 2
  │   └── 📄 Fragment 3
  └── 💡 Dream 2 (1 fragment)
      └── 📄 Fragment 1
  ```

#### Actions
- **View Dream Details**: Click on dream name
- **Add Fragment**: Click "+" icon on dream
- **Delete Dream**: Right-click → Delete
- **Refresh**: Click refresh icon in tree view toolbar

### 3. PipelineOS Integration

#### Sync Dreams
Send dreams to PipelineOS for AI-powered implementation:

1. Configure PipelineOS credentials (see [Configuration](#configuration))
2. Select dream in tree view
3. Right-click → "Send to PipelineOS"
4. Monitor progress in notification

#### Real-time Updates
- Receive live updates when dreams change in PipelineOS
- Automatic status synchronization
- Implementation completion notifications

#### Implementation Requests
- Request AI implementation directly from VS Code
- Track implementation progress
- View generated code and projects

---

## Configuration

### Extension Settings

Access via `File > Preferences > Settings` → Search "Dreamcatcher"

#### Storage Settings

```json
{
  "dreamcatcher.storage.location": "workspace",
  "dreamcatcher.storage.path": ".dreamcatcher"
}
```

**Options:**
- `workspace`: Store in workspace `.dreamcatcher` folder
- `global`: Store in user's home directory

#### PipelineOS Settings

```json
{
  "dreamcatcher.pipelineOS.enabled": false,
  "dreamcatcher.pipelineOS.apiUrl": "https://api.pipelineos.com",
  "dreamcatcher.pipelineOS.apiKey": "",
  "dreamcatcher.pipelineOS.wsUrl": "wss://api.pipelineos.com"
}
```

**Setup Steps:**

1. **Get API Key**
   - Sign up at [pipelineos.com](https://pipelineos.com)
   - Navigate to Settings → API Keys
   - Generate new key

2. **Configure Extension**
   ```json
   {
     "dreamcatcher.pipelineOS.enabled": true,
     "dreamcatcher.pipelineOS.apiKey": "your-api-key-here"
   }
   ```

3. **Test Connection**
   - Open command palette
   - Run "Dreamcatcher: Test PipelineOS Connection"
   - Check for success notification

#### AI Features (Optional)

```json
{
  "dreamcatcher.ai.enabled": true,
  "dreamcatcher.ai.provider": "openai",
  "dreamcatcher.ai.model": "gpt-4-turbo-preview"
}
```

---

## Usage

### Basic Workflow

1. **Capture Conversation**
   ```
   Have conversation in ChatGPT/Claude
   ↓
   Copy to clipboard
   ↓
   Cmd/Ctrl+Shift+P → "Dreamcatcher: Capture from Clipboard"
   ↓
   Review and edit title/tags
   ↓
   Save dream
   ```

2. **Organize Dreams**
   - View all dreams in tree view
   - Add tags for categorization
   - Group related fragments
   - Link to projects and tasks

3. **Sync with PipelineOS** (Optional)
   - Right-click dream → "Send to PipelineOS"
   - Wait for sync confirmation
   - Monitor implementation progress

### Advanced Usage

#### Custom Capture Sources

Add custom keyboard shortcuts in `keybindings.json`:

```json
{
  "key": "cmd+alt+d",
  "command": "dreamcatcher.captureConversation",
  "when": "editorTextFocus"
}
```

#### Batch Operations

Capture multiple conversations:

```json
{
  "dreamcatcher.capture.autoBatch": true,
  "dreamcatcher.capture.batchSize": 10
}
```

---

## PipelineOS Integration

### Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   VS Code       │◄────────┤   PipelineOS     │
│   Extension     │  REST   │   Backend        │
│                 │         │                  │
│  • Capture      │────────►│  • Storage       │
│  • Display      │ WebSocket│  • AI Agents     │
│  • Sync         │◄────────┤  • Projects      │
└─────────────────┘         └──────────────────┘
```

### API Endpoints

#### Import Dream
```typescript
POST /api/v1/dreams/import
Headers: {
  "Authorization": "Bearer <api_key>",
  "Content-Type": "application/json"
}
Body: {
  "dream": { /* dream object */ }
}
```

#### Get Dream Status
```typescript
GET /api/v1/dreams/{dreamId}/status
Headers: {
  "Authorization": "Bearer <api_key>"
}
```

#### Request Implementation
```typescript
POST /api/v1/dreams/{dreamId}/implement
Headers: {
  "Authorization": "Bearer <api_key>"
}
```

### WebSocket Events

#### Connection
```typescript
const ws = new WebSocket('wss://api.pipelineos.com/ws/dreamcatcher/{apiKey}');
```

#### Events
- `dream_updated`: Dream modified in PipelineOS
- `dream_deleted`: Dream removed
- `project_created`: New project generated from dream
- `implementation_completed`: AI implementation finished

---

## Troubleshooting

### Common Issues

#### Extension Not Loading

**Symptoms**: Extension doesn't appear in sidebar

**Solutions:**
1. Check VS Code version (requires 1.85.0+)
2. Reload window: `Cmd/Ctrl+Shift+P` → "Reload Window"
3. Check extension logs: `View` → `Output` → "Dreamcatcher"
4. Reinstall extension

#### Compilation Errors

**Symptoms**: TypeScript errors during `npm run compile`

**Solutions:**
1. Update Node.js to version 18+
2. Clean install dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Check tsconfig.json includes DOM lib:
   ```json
   {
     "compilerOptions": {
       "lib": ["ES2020", "DOM"]
     }
   }
   ```

#### PipelineOS Connection Failed

**Symptoms**: "Failed to connect to PipelineOS" error

**Solutions:**
1. Verify API key is correct
2. Check network connectivity
3. Test API endpoint with curl:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://api.pipelineos.com/api/v1/health
   ```
4. Check firewall/proxy settings
5. Review extension logs for detailed error

#### Dreams Not Syncing

**Symptoms**: Dreams captured but not appearing in PipelineOS

**Solutions:**
1. Check `syncedWithPipelineOS` flag in dream metadata
2. Manually trigger sync:
   - Right-click dream → "Send to PipelineOS"
3. Check for sync errors in Output panel
4. Verify PipelineOS account has sufficient storage

#### WebSocket Connection Drops

**Symptoms**: Real-time updates stop working

**Solutions:**
1. Extension automatically reconnects after 5 seconds
2. Check WebSocket URL configuration
3. Verify firewall allows WebSocket connections
4. Review browser console for WebSocket errors

### Debug Mode

Enable verbose logging:

```json
{
  "dreamcatcher.debug.enabled": true,
  "dreamcatcher.debug.logLevel": "verbose"
}
```

View logs:
- `View` → `Output` → Select "Dreamcatcher" from dropdown
- Check for error messages and stack traces

### Getting Help

1. **Check Documentation**: Review this guide and CHANGELOG.md
2. **Search Issues**: [GitHub Issues](https://github.com/yourusername/dreamcatcher/issues)
3. **Create Issue**: Include:
   - VS Code version
   - Extension version
   - Error messages
   - Steps to reproduce
   - Extension logs

---

## Development

### Setup Development Environment

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/dreamcatcher.git
   cd dreamcatcher/extensions/vscode
   npm install
   ```

2. **Watch Mode**
   ```bash
   npm run watch
   ```
   This runs TypeScript compiler in watch mode for live recompilation.

3. **Run Extension**
   - Press `F5` to launch Extension Development Host
   - Make changes and reload window to test

### Project Structure

```
extensions/vscode/
├── src/
│   ├── extension.ts              # Main entry point
│   ├── conversation-capture.ts   # Capture logic
│   ├── dreamcatcher-provider.ts  # Tree view provider
│   ├── pipelineos-integration.ts # PipelineOS sync
│   └── storage-manager.ts        # Local storage
├── out/                          # Compiled JavaScript
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript config
└── README.md                     # Basic readme
```

### Key Modules

#### extension.ts
- Extension activation/deactivation
- Command registration
- Component initialization

#### conversation-capture.ts
- Text capture and parsing
- Dream/fragment creation
- Title and tag extraction

#### dreamcatcher-provider.ts
- VS Code tree view implementation
- Dream hierarchy display
- Tree item actions

#### pipelineos-integration.ts
- REST API client
- WebSocket connection management
- Sync operations

#### storage-manager.ts
- Local file system operations
- Dream CRUD operations
- Workspace/global storage handling

### Building for Production

```bash
# Compile TypeScript
npm run compile

# Package extension
vsce package

# Publish to VS Code Marketplace
vsce publish
```

### Testing

```bash
# Run unit tests (when implemented)
npm test

# Run integration tests
npm run test:integration
```

---

## Architecture

### Data Flow

```
┌──────────────────────────────────────────────────────┐
│                     VS Code UI                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────┐    ┌──────────────┐    ┌────────┐ │
│  │   Tree      │───▶│  Capture     │───▶│Storage │ │
│  │   View      │    │  Engine      │    │Manager │ │
│  └─────────────┘    └──────────────┘    └────────┘ │
│         │                   │                  │    │
│         │                   │                  │    │
│         ▼                   ▼                  ▼    │
│  ┌─────────────────────────────────────────────┐   │
│  │         PipelineOS Integration              │   │
│  │   • REST API   • WebSocket   • Sync         │   │
│  └─────────────────────────────────────────────┘   │
│                         │                           │
└─────────────────────────┼───────────────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │  PipelineOS    │
                 │  Backend       │
                 └────────────────┘
```

### Type System

```typescript
// Core Types
interface Dream {
  id: string;
  title: string;
  description: string;
  source: string;
  tags: string[];
  created: string;
  updated: string;
  fragments: Fragment[];
  entities: string[];
  status: 'active' | 'archived';
  syncedWithPipelineOS?: boolean;
}

interface Fragment {
  id: string;
  title: string;
  content: string;
  source: string;
  url?: string;
  date: string;
  entities: string[];
  highlights: string[];
}

interface PipelineOSConfig {
  enabled: boolean;
  apiUrl: string;
  apiKey: string;
  wsUrl: string;
}
```

---

## Contributing

### Guidelines

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'feat: add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Code Style

- TypeScript strict mode enabled
- ESLint configuration follows
- Format with Prettier
- Add JSDoc comments for public APIs

### Testing Requirements

- Unit tests for all new features
- Integration tests for API interactions
- Manual testing in VS Code Development Host

---

## Release History

### v2.0.0 (Current)
- Initial VS Code extension release
- Conversation capture functionality
- PipelineOS integration
- Tree view navigation
- WebSocket real-time sync

### v2.4.1 (2025-11-13)
- ✅ Fixed all TypeScript compilation errors
- Enhanced type safety
- Improved null checks
- Better WebSocket type annotations

### Upcoming Features

See [CHANGELOG.md](../../CHANGELOG.md#development-roadmap) for full roadmap.

---

## License

MIT License - See [LICENSE](../../LICENSE) for details

---

## Support

- **Documentation**: [docs.dreamcatcher.dev](https://docs.dreamcatcher.dev)
- **Issues**: [GitHub Issues](https://github.com/yourusername/dreamcatcher/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/dreamcatcher/discussions)
- **Email**: support@dreamcatcher.dev

---

**Made with ❤️ by the Dreamcatcher team**
