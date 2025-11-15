# Dreamcatcher VS Code Extension

**Version:** 2.0.0  
**Status:** Development  
**Purpose:** Capture AI conversations directly in VS Code/Cursor

---

## 🎯 **Overview**

The Dreamcatcher VS Code extension brings AI conversation capture directly into your development environment. Capture conversations, create dreams, and sync with PipelineOS without leaving your editor.

---

## 🚀 **Features**

### **Core Features**
- **Direct Capture**: Capture AI conversations from clipboard or selection
- **Quick Actions**: Right-click context menu for selected text
- **Tree View**: Browse dreams and fragments in the sidebar
- **Status Bar**: Quick access to capture functionality
- **Keyboard Shortcuts**: Fast capture with hotkeys

### **Integration Features**
- **PipelineOS Sync**: Real-time sync with PipelineOS
- **WebSocket Updates**: Live updates from PipelineOS
- **Project Creation**: Turn dreams into PipelineOS projects
- **Implementation Tracking**: Monitor dream implementation status

### **Storage Features**
- **Local Storage**: Store dreams locally in VS Code
- **Supabase Sync**: Optional cloud synchronization
- **Export/Import**: Backup and restore dreams
- **Search**: Find dreams and fragments quickly

---

## 🔧 **Installation**

### **From Source**
```bash
cd extensions/vscode
npm install
npm run compile
```

### **Package Extension**
```bash
npm install -g vsce
vsce package
```

### **Install Package**
```bash
code --install-extension dreamcatcher-vscode-2.0.0.vsix
```

---

## ⚙️ **Configuration**

### **Basic Settings**
```json
{
  "dreamcatcher.enabled": true,
  "dreamcatcher.autoCapture": false,
  "dreamcatcher.storage.type": "local",
  "dreamcatcher.limits.maxDreams": 50
}
```

### **PipelineOS Integration**
```json
{
  "dreamcatcher.pipelineOS.enabled": true,
  "dreamcatcher.pipelineOS.apiUrl": "https://api.pipelineos.dev",
  "dreamcatcher.pipelineOS.apiKey": "your-api-key",
  "dreamcatcher.pipelineOS.wsUrl": "wss://ws.pipelineos.dev"
}
```

### **Supabase Configuration**
```json
{
  "dreamcatcher.storage.type": "supabase",
  "dreamcatcher.supabase.url": "https://your-project.supabase.co",
  "dreamcatcher.supabase.key": "your-supabase-key"
}
```

---

## 🎮 **Usage**

### **Keyboard Shortcuts**
- `Ctrl+Shift+C` (Cmd+Shift+C on Mac): Capture conversation
- `Ctrl+Shift+Q` (Cmd+Shift+Q on Mac): Quick capture from clipboard
- `Ctrl+Shift+D` (Cmd+Shift+D on Mac): Create dream from selection

### **Commands**
- `Dreamcatcher: Capture AI Conversation` - Open capture dialog
- `Dreamcatcher: Open Dashboard` - Open web dashboard
- `Dreamcatcher: Sync with PipelineOS` - Sync local dreams
- `Dreamcatcher: Create Dream from Selection` - Capture selected text
- `Dreamcatcher: Quick Capture` - Capture from clipboard

### **Context Menu**
- Right-click on selected text → "Create Dream from Selection"
- Right-click on dream in tree view → "Send to PipelineOS"

---

## 🏗️ **Architecture**

### **Components**
- **Extension**: Main VS Code extension entry point
- **ConversationCapture**: Handles conversation capture logic
- **DreamcatcherProvider**: Tree view data provider
- **StorageManager**: Local storage management
- **PipelineOSIntegration**: PipelineOS API integration

### **Data Flow**
```
User Input → ConversationCapture → StorageManager → Tree View
                ↓
         PipelineOSIntegration → PipelineOS API
```

---

## 🔌 **API Integration**

### **PipelineOS API**
```typescript
interface PipelineOSConfig {
  enabled: boolean;
  apiUrl: string;
  apiKey: string;
  wsUrl: string;
}
```

### **WebSocket Events**
- `dream_updated`: Dream updated from PipelineOS
- `dream_deleted`: Dream deleted from PipelineOS
- `project_created`: Project created from dream
- `implementation_completed`: Dream implementation completed

---

## 📊 **Tree View Structure**

```
Dreamcatcher
├── Dream 1
│   ├── Fragment 1
│   │   ├── Features (3)
│   │   ├── Code Snippets (2)
│   │   ├── Source: ChatGPT
│   │   └── Date: 12/15/2024
│   └── Fragment 2
├── Dream 2
└── Dream 3
```

---

## 🎯 **Use Cases**

### **AI Conversation Capture**
1. Copy AI conversation from ChatGPT/Claude
2. Use `Ctrl+Shift+C` to capture
3. Enter project name and description
4. Dream is created and visible in tree view

### **Code Selection Capture**
1. Select code or text in editor
2. Right-click → "Create Dream from Selection"
3. Dream is created with selected content

### **PipelineOS Integration**
1. Configure PipelineOS API settings
2. Capture dreams in VS Code
3. Use "Sync with PipelineOS" to send dreams
4. Monitor implementation status in real-time

---

## 🔧 **Development**

### **Project Structure**
```
extensions/vscode/
├── src/
│   ├── extension.ts
│   ├── conversation-capture.ts
│   ├── dreamcatcher-provider.ts
│   ├── storage-manager.ts
│   └── pipelineos-integration.ts
├── package.json
├── tsconfig.json
└── README.md
```

### **Build Commands**
```bash
npm run compile    # Compile TypeScript
npm run watch      # Watch mode
npm run lint       # Lint code
npm run test       # Run tests
```

### **Testing**
```bash
# Run extension in development
F5 # Start debugging
```

---

## 📈 **Roadmap**

### **Phase 1: Core Features**
- [x] Basic conversation capture
- [x] Tree view for dreams
- [x] Local storage
- [x] Keyboard shortcuts

### **Phase 2: Integration**
- [ ] PipelineOS API integration
- [ ] WebSocket real-time updates
- [ ] Project creation from dreams
- [ ] Implementation status tracking

### **Phase 3: Advanced Features**
- [ ] Supabase cloud sync
- [ ] Team collaboration
- [ ] Advanced search and filtering
- [ ] Custom themes and branding

### **Phase 4: Platform Expansion**
- [ ] Cursor-specific features
- [ ] JetBrains IDE support
- [ ] Sublime Text support
- [ ] Vim/Neovim support

---

## 🤝 **Contributing**

### **Development Setup**
1. Clone the repository
2. Install dependencies: `npm install`
3. Compile: `npm run compile`
4. Debug: Press F5 in VS Code

### **Code Style**
- TypeScript with strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

---

## 📄 **License**

MIT License - see LICENSE file for details

---

## 🔗 **Links**

- **Main Project**: [Dreamcatcher](https://github.com/dreamcatcher/dreamcatcher)
- **PipelineOS**: [PipelineOS](https://github.com/pipelineos/pipelineos)
- **Documentation**: [Docs](https://docs.dreamcatcher.dev)
- **Issues**: [GitHub Issues](https://github.com/dreamcatcher/dreamcatcher/issues)
