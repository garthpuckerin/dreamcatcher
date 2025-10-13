# Dreamcatcher

**Version:** 2.0.0  
**Status:** Dual-Track Strategy (PipelineOS Integration + Standalone Freemium)  
**Purpose:** AI conversation capture and organization platform

---

## 🎯 **Overview**

Dreamcatcher is an AI-powered conversation capture and organization platform that helps developers turn AI conversations into actionable projects. It operates on a **dual-track strategy**:

1. **PipelineOS Integration**: Enterprise conversation capture module
2. **Standalone Freemium**: Personal AI conversation organizer

---

## 🚀 **Features**

### **Core Features**
- **AI Conversation Capture**: Automatically capture ChatGPT and Claude conversations
- **Smart Organization**: Organize conversations into "dreams" and "fragments"
- **Project Detection**: Auto-detect project names and context
- **Code Extraction**: Extract code snippets and features
- **Real-Time Sync**: Bidirectional sync with PipelineOS (when enabled)

### **AI-Powered Features**
- **Smart Summarization**: AI-generated dream summaries
- **Auto-Tagging**: Intelligent tag suggestions
- **Content Analysis**: Extract features and requirements
- **Project Name Detection**: AI-powered project identification

### **Integration Features**
- **PipelineOS Integration**: Send dreams to PipelineOS for implementation
- **GitHub Integration**: Connect to repositories
- **Export Options**: Export to various formats
- **API Access**: RESTful API for integrations

---

## 🏗️ **Architecture**

### **Dual-Mode Operation**

```
┌─────────────────────────────────────────────────────────────┐
│                    Dreamcatcher Ecosystem                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────┐   │
│  │   PipelineOS        │    │    Standalone            │   │
│  │   Integration       │    │    Freemium              │   │
│  │                     │    │                         │   │
│  │  • Enterprise       │    │  • Personal Use         │   │
│  │  • Conversation →    │    │  • Community Adoption  │   │
│  │    Implementation    │    │  • Freemium Model       │   │
│  │  • AI Agents         │    │  • Local Storage       │   │
│  │  • Project Mgmt      │    │  • Basic Features       │   │
│  └─────────────────────┘    └─────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Technology Stack**
- **Frontend**: React 18, Vite 5, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Storage, Auth, Realtime)
- **AI**: OpenAI GPT-4 Turbo, GPT-3.5 Turbo
- **Extension**: Chrome Extension Manifest V3
- **Storage**: LocalStorage (Free) + Supabase Cloud Sync (Premium)

---

## 🚀 **Quick Start**

### **Standalone Mode**

1. **Install Extension**
   ```bash
   # Load unpacked extension in Chrome
   # Navigate to chrome://extensions/
   # Enable "Developer mode"
   # Click "Load unpacked" and select dreamcatcher-extension folder
   ```

2. **Start Web App**
   ```bash
   cd dreamcatcher
   npm install
   npm run dev
   ```

3. **Configure AI (Optional)**
   ```bash
   # Create .env.local file
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_AI_ENABLED=true
   VITE_AI_MODEL=gpt-4-turbo-preview
   ```

4. **Start Capturing**
   - Visit ChatGPT or Claude.ai
   - Click the Dreamcatcher capture button
   - Organize your conversations into dreams

### **PipelineOS Integration Mode**

1. **Configure PipelineOS**
   ```javascript
   // In extension popup
   const config = {
     mode: 'pipelineos',
     pipelineOS: {
       enabled: true,
       apiUrl: 'https://your-pipelineos-instance.com',
       apiKey: 'your_api_key'
     }
   };
   ```

2. **Enable Sync**
   - Extension automatically syncs with PipelineOS
   - Dreams become projects in PipelineOS
   - Receive implementation updates

---

## 📊 **Business Model**

### **PipelineOS Integration**
- **Revenue Model**: Included in PipelineOS subscription
- **Target Market**: Enterprise customers
- **Value Proposition**: Conversation-to-implementation workflow
- **Pricing**: $50-200/month per user (via PipelineOS)

### **Standalone Freemium**
- **Revenue Model**: Freemium with premium features
- **Target Market**: Individual developers and small teams
- **Value Proposition**: Personal AI conversation organization
- **Pricing**: 
  - **Free**: LocalStorage, 50 dreams, basic features
  - **Premium**: $5-10/month, Supabase cloud sync, unlimited dreams

---

## 🔧 **Development**

### **Prerequisites**
- Node.js 20+
- Chrome browser
- OpenAI API key (optional)

### **Local Development**

```bash
# Clone repository
git clone https://github.com/your-org/dreamcatcher.git
cd dreamcatcher

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Extension Development**

```bash
# Navigate to extension directory
cd dreamcatcher-extension

# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select dreamcatcher-extension folder
```

---

## 📚 **Documentation**

### **Strategic Documentation**
- [PipelineOS Integration Strategy](docs/strategic/PIPELINEOS_INTEGRATION_STRATEGY.md)
- [Dual-Track Roadmap](docs/strategic/DUAL_TRACK_ROADMAP.md)
- [Freemium Storage Strategy](docs/strategic/FREEMIUM_STORAGE_STRATEGY.md)
- [Strategic Analysis](docs/strategic/STRATEGIC_ANALYSIS.md)

### **Architecture Documentation**
- [Microservices Architecture](docs/architecture/MICROSERVICES_ARCHITECTURE.md)
- [System Design](docs/architecture/SYSTEM_DESIGN.md)
- [Database Schema](docs/architecture/DATABASE_SCHEMA.md)

### **Technical Documentation**
- [AI Integration Guide](docs/technical/AI_INTEGRATION_GUIDE.md)
- [API Documentation](docs/technical/API_DOCUMENTATION.md)
- [Extension Development](docs/technical/EXTENSION_DEVELOPMENT.md)

### **User Documentation**
- [Getting Started](docs/user/GETTING_STARTED.md)
- [User Guide](docs/user/USER_GUIDE.md)
- [FAQ](docs/user/FAQ.md)

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### **Code Standards**
- ESLint for code quality
- Prettier for formatting
- Jest for testing
- TypeScript for type safety

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 **Roadmap**

### **Phase 1: Foundation (Q1 2025)**
- [ ] Extension dual-mode operation
- [ ] PipelineOS sync mechanism
- [ ] Standalone freemium launch
- [ ] 1K+ users across both tracks

### **Phase 2: Enhancement (Q2 2025)**
- [ ] Advanced AI features
- [ ] Mobile companion app
- [ ] Enterprise features
- [ ] 5K+ users, $100K ARR

### **Phase 3: Scale (Q3 2025)**
- [ ] Market expansion
- [ ] Strategic partnerships
- [ ] Advanced analytics
- [ ] 15K+ users, $300K ARR

### **Phase 4: Domination (Q4 2025)**
- [ ] Market leadership
- [ ] Platform evolution
- [ ] Innovation labs
- [ ] 50K+ users, $1M ARR

---

## 🔗 **Links**

- **Website**: [dreamcatcher.dev](https://dreamcatcher.dev)
- **Documentation**: [docs.dreamcatcher.dev](https://docs.dreamcatcher.dev)
- **Chrome Extension**: [Chrome Web Store](https://chrome.google.com/webstore)
- **GitHub**: [github.com/your-org/dreamcatcher](https://github.com/your-org/dreamcatcher)

---

## 📞 **Support**

- **Email**: support@dreamcatcher.dev
- **Discord**: [Discord Server](https://discord.gg/dreamcatcher)
- **GitHub Issues**: [Report Issues](https://github.com/your-org/dreamcatcher/issues)

---

**Dreamcatcher - Turn AI conversations into actionable projects.**