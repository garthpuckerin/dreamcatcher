# Dreamcatcher Project Plan

## Overview

Dreamcatcher is a two-part system for capturing, organizing, and managing AI conversation fragments:

1. **Browser Extension** (`dreamcatcher-extension/`) - Captures conversations from ChatGPT and Claude
2. **Web App** (`dreamcatcher/`) - Dashboard for viewing and organizing captures

## Project Structure

```
C:\MPGWorldwide\
├── dreamcatcher/                    # Web App (THIS FOLDER)
│   ├── src/
│   │   ├── App.jsx                  # Main React component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── index.html                   # HTML entry
│   ├── vite.config.js               # Vite config
│   ├── package.json                 # Dependencies
│   ├── .gitignore                   # Git ignore
│   ├── README.md                    # Web app docs
│   └── PROJECT_PLAN.md              # This file
│
└── dreamcatcher-extension/          # Browser Extension
    ├── manifest.json                 # Extension config
    ├── content.js                    # Injection script
    ├── content.css                   # UI styles
    ├── background.js                 # Service worker
    ├── popup.html                    # Popup UI
    ├── popup.js                      # Popup logic
    ├── icons/                        # Extension icons
    │   ├── icon16.png               ✅ Generated
    │   ├── icon48.png               ✅ Generated
    │   └── icon128.png              ✅ Generated
    └── [documentation files...]
```

## Current Status

### ✅ Completed

#### Browser Extension
- ✅ Complete extension implementation
- ✅ ChatGPT and Claude.ai support
- ✅ Capture modal with multiple modes
- ✅ Auto-detection of project names
- ✅ Local storage in browser
- ✅ Export functionality
- ✅ Icon files generated
- ✅ Ready to load in Chrome

#### Web App
- ✅ React + Vite setup
- ✅ Complete UI implementation
- ✅ Dreams and Fragments data model
- ✅ Multiple view modes (Consolidated, Timeline, Fragments)
- ✅ Search and filtering
- ✅ Import/Export JSON
- ✅ LocalStorage persistence
- ✅ Beautiful dark theme UI

### 🚀 Ready to Test

Both parts are complete and ready for testing:

1. **Extension**: Load in Chrome and test on ChatGPT/Claude
2. **Web App**: Running on `http://localhost:3100`

## MVP Features

### Browser Extension
- [x] Floating capture button
- [x] Multiple capture modes
- [x] Project auto-detection
- [x] Feature extraction
- [x] Code snippet detection
- [x] Local storage
- [x] Export to JSON
- [x] Badge counter

### Web App
- [x] Create/edit/delete dreams
- [x] Add/edit/delete fragments
- [x] Search across all content
- [x] Filter by status
- [x] Tag management
- [x] Three view modes
- [x] Import/export JSON
- [x] LocalStorage persistence
- [x] Sample data for demo

## Data Model

### Dream (Project)
```javascript
{
  id: number,
  title: string,
  description: string,
  status: 'idea' | 'planning' | 'in-progress' | 'paused' | 'completed' | 'abandoned',
  tags: string[],
  created: ISO8601,
  updated: ISO8601,
  fragments: Fragment[]
}
```

### Fragment (Conversation Piece)
```javascript
{
  id: number,
  title: string,
  content: string,
  source: string,              // e.g., "ChatGPT conversation"
  url: string,                 // Original conversation URL
  date: ISO8601,
  features: string[],          // Auto-extracted features
  codeSnippets: string[]       // Code blocks found
}
```

## Workflow

### Current Workflow (MVP)
1. Use extension to capture conversations from ChatGPT/Claude
2. Data stored in browser extension storage
3. Export from extension as JSON
4. Import into web app for full management
5. Or: Manually create dreams/fragments in web app

### Future Workflow (Phase 2+)
1. Use extension to capture conversations
2. Data automatically syncs to web app
3. View real-time in dashboard
4. Optional: Sync to desktop app
5. Optional: Cloud backup/sync
6. Optional: Access from mobile app anywhere
7. Optional: Quick capture from mobile devices

## Roadmap

### Phase 1: MVP (Current) ✅
- [x] Browser extension
- [x] Web app
- [x] Local storage
- [x] Import/export

### Phase 2: Integration (Next)
- [ ] Direct integration between extension and web app
- [ ] Real-time sync via browser API
- [ ] Chrome sync storage for cross-device
- [ ] Improved import flow

### Phase 3: Desktop App
- [ ] Electron or Tauri wrapper
- [ ] Native file system access
- [ ] Better performance
- [ ] Offline-first
- [ ] Auto-updates

### Phase 4: Cloud (Optional)
- [ ] Optional cloud sync
- [ ] Multi-device support
- [ ] Backup and restore
- [ ] Collaboration features
- [ ] API for integrations

### Phase 5: Advanced Features
- [ ] AI-powered summarization
- [ ] Automatic fragment merging
- [ ] Duplicate detection
- [ ] Smart tagging
- [ ] Export to Notion/Obsidian
- [ ] Markdown export
- [ ] PDF generation

### Phase 6: Native Mobile App
- [ ] iOS app (React Native or Swift/SwiftUI)
- [ ] Android app (React Native or Kotlin/Jetpack Compose)
- [ ] Mobile-optimized UI/UX
- [ ] Push notifications for sync updates
- [ ] Offline-first architecture
- [ ] Camera integration for capturing screenshots
- [ ] Voice-to-text for quick fragment creation
- [ ] Share extension (capture from any app)
- [ ] Cloud sync with desktop/web
- [ ] Native mobile features (gestures, widgets)
- [ ] App Store and Google Play distribution

## Tech Stack

### Browser Extension
- Vanilla JavaScript (ES6+)
- Chrome Extensions API
- Manifest V3
- Chrome Storage API

### Web App
- React 18
- Vite 5
- Lucide React (icons)
- LocalStorage

### Future (Desktop)
- Electron or Tauri
- SQLite for local database
- File system integration

### Future (Cloud - Optional)
- Node.js/Deno backend
- PostgreSQL or MongoDB
- Authentication (Clerk/Auth0)
- End-to-end encryption

### Future (Mobile)
- **Cross-platform:** React Native or Flutter
- **iOS Native:** Swift, SwiftUI, CoreData
- **Android Native:** Kotlin, Jetpack Compose, Room DB
- **Backend:** Firebase or custom REST API
- **Sync:** Cloud sync with conflict resolution
- **Storage:** SQLite or Realm for local storage
- **Push:** Firebase Cloud Messaging (FCM) / APNs

## Development

### Extension Development
```bash
cd C:\MPGWorldwide\dreamcatcher-extension

# Load in Chrome:
# 1. Open chrome://extensions/
# 2. Enable Developer Mode
# 3. Click "Load unpacked"
# 4. Select dreamcatcher-extension folder

# Test on:
# - https://chat.openai.com
# - https://claude.ai
```

### Web App Development
```bash
cd C:\MPGWorldwide\dreamcatcher

# Install dependencies
npm install

# Start dev server (port 3100)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Extension Publishing
1. Create promotional materials (screenshots, video)
2. Submit to Chrome Web Store
3. Submit to Edge Add-ons (compatible)
4. Consider Firefox (requires Manifest V2 conversion)

### Web App Deployment
1. Build: `npm run build`
2. Deploy to:
   - Vercel (recommended)
   - Netlify
   - GitHub Pages
   - Cloudflare Pages
3. Configure domain
4. Enable HTTPS

### Desktop App
1. Package with Electron/Tauri
2. Code signing
3. Distribute via:
   - GitHub releases
   - Direct download
   - Microsoft Store (Windows)
   - Mac App Store

## Testing Checklist

### Extension Testing
- [ ] Loads without errors
- [ ] Capture button appears on ChatGPT
- [ ] Capture button appears on Claude
- [ ] Full conversation capture works
- [ ] Last 5 messages works
- [ ] Selected text capture works
- [ ] Project auto-detection works
- [ ] Data saves to storage
- [ ] Export produces valid JSON
- [ ] Badge counter updates
- [ ] Multiple dreams/fragments work
- [ ] No console errors

### Web App Testing
- [ ] App loads without errors
- [ ] Create dream works
- [ ] Edit dream works
- [ ] Delete dream works
- [ ] Add fragment works
- [ ] Edit fragment works  
- [ ] Delete fragment works
- [ ] Search works
- [ ] Filter by status works
- [ ] Tag management works
- [ ] Consolidated view displays correctly
- [ ] Timeline view displays correctly
- [ ] Fragments view displays correctly
- [ ] Import JSON works
- [ ] Export JSON works
- [ ] Data persists after refresh
- [ ] Sample data loads correctly

## Known Issues / TODOs

### Extension
- [ ] Selectors may break when ChatGPT/Claude updates UI
- [ ] Need better error handling for failed captures
- [ ] Add keyboard shortcut support
- [ ] Consider adding more AI platforms

### Web App
- [ ] Add confirmation dialogs for destructive actions
- [ ] Implement undo/redo
- [ ] Add keyboard shortcuts
- [ ] Improve mobile responsiveness
- [ ] Add dark/light theme toggle
- [ ] Optimize performance for large datasets

### Integration
- [ ] Direct sync between extension and web app
- [ ] Browser API integration
- [ ] Real-time updates

## Notes

- Port 3100 chosen following project convention (avoid 5000, increment by 100)
- Data format is compatible between extension and web app
- JSON export/import enables workflow bridge
- LocalStorage limits: ~10MB per domain (sufficient for MVP)
- Future: IndexedDB for larger datasets

## Resources

- Extension Docs: `dreamcatcher-extension/README.md`
- Web App Docs: `dreamcatcher/README.md`
- Chrome Extension API: https://developer.chrome.com/docs/extensions/
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

---

**Project Status**: MVP Complete, Ready for Testing  
**Last Updated**: October 11, 2025  
**Version**: 1.0.0 (MVP)

