# ✨ Dreamcatcher

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/yourusername/dreamcatcher)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-5.0.8-646cff.svg)](https://vitejs.dev/)

> **Transform scattered AI conversations into organized, actionable projects**

Dreamcatcher is a powerful project management tool designed for AI-assisted development. Capture, organize, and manage ideas from ChatGPT, Claude, and other AI platforms into structured projects with full task management capabilities.

## ✨ What is Dreamcatcher?

Stop losing valuable insights across multiple AI chat threads. Dreamcatcher consolidates your conversations into **Dreams** (projects) made up of **Fragments** (conversation pieces), complete with todos, deadlines, and progress tracking.

**Perfect for:**
- 👨‍💻 Developers managing AI-assisted projects
- 🚀 Entrepreneurs organizing product ideas
- 📝 Researchers tracking conversation-based insights
- 🎨 Creators managing multi-platform projects

## 🚀 Features

### Core Functionality
- 🗂️ **Dreams & Fragments** - Organize projects with conversation pieces
- 📋 **Project Management** - Full todo system with deadlines and categories
- 📊 **Progress Tracking** - Visual progress bars, completion metrics
- 🏢 **Brand Organization** - Group projects by brand/company
- 🔍 **Advanced Search** - Find content across all dreams instantly
- 🏷️ **Smart Filtering** - Filter by status, brand, tags, and more

### Views & Visualization
- 📈 **Summary View** - Key metrics, alerts, and progress dashboard
- ✅ **Todos View** - Complete task management interface
- 📑 **Consolidated View** - All fragments merged together
- ⏱️ **Timeline View** - Chronological development history
- 🗃️ **Fragments View** - Grid view of individual pieces

### Task Management
- ✅ **Todo System** - Add, edit, complete, and delete tasks
- 📅 **Deadline Tracking** - Visual indicators for overdue/upcoming tasks
- 🎯 **Task Categories** - Coding, Admin, Design, Marketing, DevOps, Strategy
- 🚨 **Smart Alerts** - Overdue warnings and upcoming deadline notifications
- 📊 **Progress Metrics** - Track completion percentages

### Organization
- 🏢 **5 Brand Types** - BC Innovations, BC Studio, MPGWorldwide, Accordingto, Personal
- 🎨 **Color-Coded Icons** - Visual brand and category identification
- 🏷️ **Tag System** - Flexible tagging and filtering
- 📈 **Status Tracking** - Idea, Planning, In Progress, Paused, Completed, Abandoned

### Data & Integration
- 💾 **LocalStorage** - Instant persistence (v2.0-2.1)
- ☁️ **Cloud Sync** - Supabase backend (coming in v2.2)
- 📤 **Import/Export** - JSON backup and restore
- 🔄 **Browser Extension** - Auto-capture from AI platforms (separate repo)

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

App will open at `http://localhost:3100`

### Build for Production

```bash
npm run build
```

## How to Use

### 1. Create a Dream
- Click "New Dream" in the sidebar
- Give it a title, description, status, and tags
- Start adding fragments

### 2. Add Fragments
- Select a dream
- Click "+ Add Fragment" 
- Paste conversation excerpts, notes, or ideas
- Tag features mentioned in the fragment

### 3. View Your Progress
- **Consolidated View**: See all fragments merged together
- **Timeline View**: Track how the project evolved over time
- **Fragments View**: Browse all pieces in a grid

### 4. Import from Extension
- Use the Dreamcatcher browser extension to capture conversations
- Export from extension
- Import the JSON file into the web app

### 5. Export & Backup
- Click the download icon to export all data
- Save the JSON file for backup
- Import later to restore

## Data Storage

- Data is stored in browser **localStorage**
- Persists between sessions
- Export regularly for backup
- JSON format for portability

## Project Structure

```
dreamcatcher/
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies
└── README.md             # This file
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **LocalStorage** - Data persistence

## Future Features (MVP Roadmap)

- [ ] Desktop app (Electron/Tauri) - Phase 3
- [ ] Cloud sync (optional) - Phase 4
- [ ] Advanced search with filters - Phase 5
- [ ] AI-powered summarization - Phase 5
- [ ] Export to Markdown/PDF - Phase 5
- [ ] Integration with note-taking apps - Phase 5
- [ ] Native mobile apps (iOS/Android) - Phase 6
- [ ] Voice-to-text capture - Phase 6
- [ ] Share extensions for mobile - Phase 6
- [ ] Real-time collaboration - Future

## Integration with Browser Extension

The Dreamcatcher browser extension captures conversations from ChatGPT and Claude.ai. The web app provides a full-featured dashboard for viewing and organizing those captures.

**Workflow:**
1. Use extension to capture AI conversations
2. Export data from extension
3. Import into web app for advanced management
4. Or: Access extension data directly (future feature)

## Development

### Port Configuration

The app runs on port **3100** by default (following project convention to avoid port 5000 and increment by 100).

### Adding Features

The app is structured as a single React component with multiple sub-components:
- `ConsolidatedView` - Merged fragments view
- `TimelineView` - Chronological timeline
- `FragmentsView` - Grid of fragments
- `FragmentView` - Single fragment detail
- `DreamForm` - Create/edit dreams
- `FragmentForm` - Create/edit fragments
- `Modal` - Reusable modal wrapper

### Storage Format

```javascript
{
  id: number,
  title: string,
  description: string,
  status: 'idea' | 'planning' | 'in-progress' | 'paused' | 'completed' | 'abandoned',
  tags: string[],
  created: ISO8601,
  updated: ISO8601,
  fragments: [
    {
      id: number,
      title: string,
      content: string,
      source: string,
      date: ISO8601,
      features: string[],
      codeSnippets: string[]
    }
  ]
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Development workflow and branching strategy
- Code standards and best practices
- Commit message guidelines
- Pull request process

## 📋 Roadmap

### v2.2 (Q4 2025) - Cloud Sync
- [ ] Supabase backend integration
- [ ] User authentication  
- [ ] Cross-device sync
- [ ] Collaborative features

### v2.3 (Q1 2026) - AI Features
- [ ] AI-powered document parsing
- [ ] Auto-categorization of todos
- [ ] Smart suggestions

### v3.0 (Q2 2026) - Platform Expansion
- [ ] Desktop app (Electron)
- [ ] Mobile apps (React Native)
- [ ] Team workspaces

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for complete roadmap.

## 📚 Documentation

- [Contributing Guidelines](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Project Plan](PROJECT_PLAN.md)
- [Supabase Migration Plan](SUPABASE_MIGRATION_PLAN.md)
- [Brand Structure](BRAND_STRUCTURE.md)
- [Ecosystem Vision](ECOSYSTEM_VISION.md)

## 🐛 Bug Reports & Feature Requests

Use our issue templates:
- [Report a Bug](.github/ISSUE_TEMPLATE/bug_report.md)
- [Request a Feature](.github/ISSUE_TEMPLATE/feature_request.md)

## Related Projects

- **[dreamcatcher-extension](../dreamcatcher-extension)** - Browser extension for auto-capturing conversations
- **Future:** Desktop app (Phase 3), cloud service (Phase 4), mobile apps (Phase 6)

## 📄 License

MIT License © 2025 - See [LICENSE](LICENSE) file for details

---

<div align="center">

**Built with ❤️ for the AI-powered development community**

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/dreamcatcher?style=social)](https://github.com/yourusername/dreamcatcher)

*Currently in active development - v2.1.0*

</div>
