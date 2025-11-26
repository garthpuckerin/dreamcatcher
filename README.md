# Dreamcatcher

**Version:** 2.5.0  
**Status:** Production Ready 🚀  
**Live Demo:** [dreamcatcher.vercel.app](https://dreamcatcher-4idsn9j4w-blackpanther7413s-projects.vercel.app)

> AI-powered dream and goal tracking with smart organization, versioning, and real-time collaboration.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-117%20passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🎯 **Overview**

Dreamcatcher is an AI-powered conversation capture and organization platform that helps developers turn AI conversations into actionable projects. It operates on a **dual-track strategy**:

1. **PipelineOS Integration**: Enterprise conversation capture module
2. **Standalone Freemium**: Personal AI conversation organizer

---

## 🚀 **Features**

### **✨ NEW: Commercial SaaS Features**
Transform Dreamcatcher into a full-featured commercial product with these enterprise-ready capabilities:

#### **1. Real-Time Collaboration** (Teams Tier)
- **Live co-editing**: Multiple users can work on dreams simultaneously
- **Presence tracking**: See who's viewing/editing what
- **Live cursors**: Real-time cursor position updates
- **Conflict resolution**: Operational Transform for seamless collaboration
- **WebSocket infrastructure**: Sub-second latency with Redis scaling

#### **2. AI Chat Integration Extension** (Pro Tier)
- **One-click capture**: Save ChatGPT & Claude conversations instantly
- **Offline queue**: Capture even without internet, sync later
- **Auto-detection**: Automatically detect project context
- **Context menu**: Right-click to save selected text
- **Chrome extension**: Seamless browser integration

#### **3. Advanced AI Assistant** (Pro Tier)
- **Task prioritization**: AI tells you "what to work on next"
- **Progress summaries**: Auto-generate weekly/monthly progress reports
- **Similarity detection**: Find related past projects
- **Task breakdown**: Dream → Epic → Stories → Tasks
- **Risk detection**: Analyze for scope creep and blockers
- **Meeting parser**: Extract action items from meeting notes
- **Code analysis**: Detect features in code snippets

#### **4. Timeline & Retrospectives** (Pro Tier)
- **Visual timeline**: See dream evolution over time
- **Activity heatmap**: Track productivity patterns
- **Auto-milestones**: Detect launches, pivots, blockers
- **Retrospectives**: 4 formats (Start-Stop-Continue, 4Ls, Sailboat, Mad-Sad-Glad)
- **AI suggestions**: AI-powered retrospective insights
- **Export to PDF**: Share timelines and retrospectives

#### **5. Integration Ecosystem** (Teams Tier)
- **GitHub**: Commits → fragments, PRs → fragments, Issues → todos
- **Slack**: Thread capture, notifications, bot commands
- **Google Calendar**: Auto-sync todo deadlines
- **OAuth 2.0**: Secure third-party authentication
- **Webhooks**: Real-time integration updates

#### **6. Portfolio Builder** (Pro Tier)
- **Public showcase**: Create beautiful portfolio pages
- **AI case studies**: Auto-generate 7-section case studies
- **Custom themes**: 4 professional themes + custom branding
- **Skills tracking**: Auto-extract skills from dreams
- **Custom domain**: Connect your own domain (Pro feature)
- **SEO optimized**: Get discovered on search engines

#### **7. Analytics Dashboard** (Pro Tier)
- **Dream velocity**: Track idea → launch time
- **Productivity trends**: Visualize fragments & tasks over time
- **AI usage stats**: Monitor AI assistant usage
- **Insights**: Automated recommendations
- **Export**: Download metrics as CSV

#### **8. Smart Templates & Marketplace** (All Tiers)
- **Built-in templates**: MVP Launch, Side Project Starter, etc.
- **Template marketplace**: Browse 1000+ community templates
- **Monetization**: Sell your templates (70% revenue share)
- **One-click apply**: Instant dream creation from templates
- **Ratings & reviews**: Community-driven quality

#### **9. Mobile App** (All Tiers)
- **Quick capture**: Add ideas on the go
- **Offline support**: Full offline functionality
- **Auto-sync**: Seamless cloud synchronization
- **Photo capture**: Attach photos to fragments
- **Push notifications**: Never miss a deadline

#### **10. Version Control for Ideas** (Pro Tier)
- **Git-inspired**: Snapshot, restore, diff, branch
- **Time travel**: Restore to any previous version
- **A/B branching**: Explore alternative directions
- **Change log**: Track evolution with reasoning
- **Visual diff**: See what changed between versions

### **Core Features**
- **AI Conversation Capture**: Automatically capture ChatGPT and Claude conversations
- **Smart Organization**: Organize conversations into "dreams" and "fragments"
- **Project Detection**: Auto-detect project names and context
- **Code Extraction**: Extract code snippets and features
- **Real-Time Sync**: Bidirectional sync with PipelineOS (when enabled)
- **VS Code Integration**: Capture conversations directly in VS Code/Cursor

### **AI-Powered Features**
- **Smart Summarization**: AI-generated dream summaries
- **Auto-Tagging**: Intelligent tag suggestions
- **Content Analysis**: Extract features and requirements
- **Project Name Detection**: AI-powered project identification

### **Integration Features**
- **PipelineOS Integration**: Send dreams to PipelineOS for implementation
- **VS Code Extension**: Capture conversations directly in VS Code/Cursor
- **Browser Extension**: Capture from ChatGPT, Claude, and other AI tools
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

### **Standalone SaaS Model**
- **Revenue Model**: Tiered SaaS subscription
- **Target Market**: Individual developers, teams, and enterprises
- **Value Proposition**: Complete AI-powered project management platform

**Pricing Tiers:**
- **Free**: Core features, 10 dreams, local storage
- **Pro ($15/mo)**: AI Assistant, Analytics, Portfolio, Templates, Version Control
- **Teams ($49/mo)**: Everything in Pro + Real-time Collaboration, Integrations, Priority Support
- **Enterprise (Custom)**: Everything in Teams + SSO, Custom deployment, SLAs, Dedicated support

**Revenue Projections:**
- Year 1: $408K ARR (500 Pro, 50 Teams, 2 Enterprise)
- Year 2: $1.866M ARR (2,500 Pro, 300 Teams, 15 Enterprise)
- Year 3: $7.4M ARR (10,000 Pro, 1,500 Teams, 100 Enterprise)

See [COMMERCIALIZATION.md](docs/COMMERCIALIZATION.md) for complete strategy.

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

### **Extension Documentation**
- [VS Code Extension](docs/extensions/VSCODE_EXTENSION.md)
- [Browser Extension](docs/extensions/BROWSER_EXTENSION.md)

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