# Changelog

All notable changes to the Dreamcatcher project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Browser extension integration
- Local AI models (Ollama integration)
- Natural language todo creation
- Automated progress updates from git commits

## [2.4.0] - 2025-10-12

### Added - AI-Powered Features 🤖
- **OpenAI Integration**: Full GPT-4 Turbo integration for intelligent features
- **Document Upload & Parsing**: Upload TXT, MD, DOCX files and automatically extract tasks, deadlines, and categories
- **Smart Tag Suggestions**: AI-powered tag recommendations based on dream content
- **Auto-Summarization**: Generate concise summaries of dreams from their fragments
- **Fragment Highlights**: Extract key points and decisions from conversation fragments
- **Project Name Detection**: Automatically detect project names from conversation content
- **Semantic Search**: Natural language search beyond keyword matching (e.g., "web apps with databases")
- **Document Management**: Full document lifecycle (upload, parse, store, delete)

### Components
- `DocumentUpload`: Drag-and-drop document upload with AI parsing
- `AIAssistant`: Reusable AI suggestion component for tags and summaries
- New hooks: `useAI()`, `useDocuments()`
- New utilities: `src/lib/ai.js`, `src/lib/documentParser.js`

### Dependencies
- `openai@^4.20.1` - OpenAI API client
- `mammoth@^1.6.0` - DOCX file parsing
- `pdf-parse@^1.1.1` - PDF file parsing (backend only)

### Configuration
- New environment variables:
  - `VITE_OPENAI_API_KEY` - OpenAI API key (required for AI features)
  - `VITE_AI_MODEL` - AI model selection (default: gpt-4-turbo-preview)
  - `VITE_AI_ENABLED` - Toggle AI features on/off

### Features
- **Document Parser**: Extracts todos, deadlines, categories, summaries, and key points from documents
- **Tag Suggester**: Analyzes dream content and suggests 5-8 relevant tags
- **Summary Generator**: Creates 2-3 sentence summaries of dreams based on fragments
- **Highlight Extractor**: Identifies 3-5 key highlights from fragment conversations
- **Semantic Search Engine**: Understands search intent and ranks results by relevance
- **Project Detector**: Identifies project names mentioned in conversations
- **File Support**: TXT, MD, DOCX (PDF requires backend)
- **Validation**: File type and size validation (max 10MB)
- **Error Handling**: Graceful fallbacks when AI unavailable or errors occur

### UI/UX Improvements
- Drag-and-drop document upload with visual feedback
- Real-time parsing status with loading animations
- AI suggestion buttons with sparkle icons
- Inline tag suggestions (click to apply individual tags)
- Summary preview before applying
- AI availability indicator
- Semantic search toggle (AI vs basic text search)

### Technical Details
- Client-side OpenAI integration (development only - requires backend proxy for production)
- Fallback to basic functionality when AI unavailable
- Optional AI features (app works without OpenAI key)
- JSON-based AI responses for reliability
- Temperature and token controls for quality/cost balance
- Rate limiting considerations documented
- Security warnings for production deployment

### Documentation
- `AI_INTEGRATION_GUIDE.md`: Complete integration and usage guide
- `AI_TEST_PLAN.md`: Comprehensive testing procedures
- `.env.example`: Updated with AI configuration
- README updated with AI features section

### Performance
- Tag suggestions: ~3-5 seconds
- Dream summaries: ~5-10 seconds
- Document parsing: ~10-15 seconds (depends on document size)
- Semantic search: ~5-8 seconds
- All operations include loading states and progress indicators

### Security Considerations
- ⚠️ Development mode uses browser-based OpenAI client
- Production requires backend API proxy (guide included)
- API key validation and error handling
- File upload validation (type and size)
- No API key exposure in DOM or logs (except debug mode)

### Cost Management
- Estimated cost: $5-20/month for moderate use
- Cost optimization tips documented
- Option to use GPT-3.5 for lower costs
- Result caching recommended
- Batch operations supported

### Known Limitations
- PDF parsing requires backend implementation
- Browser-based API calls not recommended for production
- No caching implemented yet (results re-generated each time)
- No rate limiting on frontend (should be added in production)
- Large documents (>10MB) not supported

### Migration Notes
- Fully backward compatible with v2.3.0
- AI features optional - app works without them
- No breaking changes to existing functionality
- New dependencies required (`npm install`)
- Environment configuration required for AI features

### Future Enhancements (Planned for v2.5+)
- Natural language todo creation ("remind me to deploy on Friday")
- Smart dependencies detection
- Automated progress updates from git commits
- Voice-to-todo using Whisper API
- Local AI models (Ollama) for offline operation
- Custom fine-tuned models for project-specific detection

## [2.1.0] - 2025-10-11

### Added - Project Management Features
- **Dream Summary View**: Comprehensive overview with key metrics, progress tracking, and alerts
- **Todos System**: Full task management with add/edit/delete/complete functionality
- **Brand Organization**: Filter and group dreams by brand (BC Innovations, BC Studio, MPGWorldwide, Accordingto, Personal)
- **Task Categories**: 6 task types (Coding, Admin, Design, Marketing, DevOps, Strategy) with color-coded icons
- **Progress Tracking**: Visual progress bars, completion percentages, overdue/upcoming indicators
- **Smart Alerts**: Overdue task warnings and upcoming deadline notifications (7-day window)
- **Todo Details**: Deadlines, categories, notes, and completion status for each task
- **Brand Badges**: Visual brand indicators on dream cards in All Dreams view
- **Summary Tab**: New dedicated tab showing dream summary, metrics, and timeline

### Changed
- Dream Detail View now defaults to Summary tab (was Consolidated)
- Added brand filter dropdown in All Dreams view toolbar
- Dream cards now display brand icon and name
- Dream cards show todo completion ratio when todos exist
- Updated sample data with real todos, brands, and summaries

### Technical
- New dream properties: `brand`, `summary`, `todos[]`, `documents[]`
- Todo data structure: `id`, `title`, `category`, `deadline`, `completed`, `source`, `notes`
- New components: `SummaryView`, `TodosView`, `TodoForm`
- Enhanced filtering logic to support brand filtering
- Added todo progress calculations and deadline validation
- New icons: `CheckSquare`, `ListTodo`, `Briefcase`, `FileText`, `AlertCircle`, `TrendingUp`

### UX Improvements
- Visual feedback for overdue tasks (red border)
- Visual feedback for upcoming tasks (orange border)
- Completed todos shown separately with strike-through styling
- Empty states for todos with helpful prompts
- Responsive todo forms with category dropdown
- Date picker for deadline selection

## [2.0.0] - 2025-10-11

### Added
- All Dreams gallery view as default landing page
- Recent Dreams section in sidebar (last 10 accessed)
- Dynamic real-time search across all dream data
- Tag filtering (click to filter by tags)
- Multiple sort options (updated, created, name, status, fragment count)
- Card-based dream display with hover effects
- Breadcrumb navigation
- Auto-tracking of recently accessed dreams

### Changed
- Sidebar now shows "All Dreams" link + Recent Dreams instead of full dream tree
- Main content area defaults to gallery view instead of dream detail
- Navigation flow: All Dreams → Dream Detail → Fragment Detail
- Improved scalability for large numbers of dreams

### Technical
- New state: `mainView`, `dreamView`, `recentDreams`, `filterTags`, `sortBy`
- New components: `AllDreamsView`, `DreamDetailView` (refactored)
- LocalStorage tracking for recent dreams
- Enhanced filtering and sorting logic
- Removed `expandedDreams` state (no longer needed)

## [1.0.0] - 2025-10-11

### Added
- Initial release of Dreamcatcher web application
- Dream management (create, edit, delete)
- Fragment management within dreams
- Three view modes for dreams:
  - Consolidated view: All fragments combined
  - Timeline view: Chronological fragment display
  - Fragments view: Grid of individual fragments
- Search functionality across dreams and fragments
- Status filtering (Idea, Planning, In Progress, Paused, Completed, Abandoned)
- Tag system for organizing dreams
- Expandable dream tree in sidebar
- Fragment detail view
- Import/Export functionality (JSON)
- LocalStorage persistence
- Sample data for initial setup
- Dark theme UI
- Responsive layout

### Technical Details
- React 18 with hooks
- Vite 5 build system
- Lucide React icons
- Inline CSS styling
- LocalStorage for data persistence

### Components
- `Dreamcatcher` (main component)
- `ConsolidatedView`
- `TimelineView`
- `FragmentsView`
- `FragmentView`
- `DreamForm`
- `FragmentForm`
- `Modal`

### File Structure
```
dreamcatcher/
├── src/
│   ├── App.jsx (956 lines)
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Known Limitations
- No cloud sync (local storage only)
- No browser extension integration yet
- Sidebar doesn't scale well with many dreams
- No mobile optimization

---

## Version History

### v1.0.0 (2025-10-11)
- Initial working release
- Core dream and fragment management
- Sidebar tree navigation
- Three view modes
- Search and filtering
- **Archived as:** `archive/App.v1.0.0.jsx`

### v2.0.0 (2025-10-11)
- All Dreams gallery view
- Recent Dreams sidebar
- Dynamic search with tag filtering
- Enhanced scalability
- **Build file:** `archive/App.v2.0.0.jsx`
- **Status:** ✅ Implemented and Live

---

## Backup Strategy

All versions are archived in the `archive/` directory with the naming convention:
- `App.v{MAJOR}.{MINOR}.{PATCH}.jsx`

Before any major UI changes:
1. Archive current version
2. Build new version in separate file
3. Verify complete functionality
4. Swap implementation
5. Update changelog
6. Commit to version control

---

## Migration Notes

### v1.0.0 → v2.0.0

**State Changes:**
- `view` → split into `mainView` and `dreamView`
- Added: `recentDreams`, `filterTags`, `sortBy`
- Removed: `expandedDreams` (not needed in new UI)

**LocalStorage:**
- Existing: `dreamcatcher-dreams`
- New: `dreamcatcher-recent` (array of dream IDs)

**Data Structure:**
No changes to dream/fragment data structure. Fully backward compatible.

**User Impact:**
- All existing data preserved
- UI navigation changes (gallery vs tree)
- New features added, no features removed

---

[Unreleased]: https://github.com/yourusername/dreamcatcher/compare/v2.4.0...HEAD
[2.4.0]: https://github.com/yourusername/dreamcatcher/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/yourusername/dreamcatcher/compare/v2.1.0...v2.3.0
[2.1.0]: https://github.com/yourusername/dreamcatcher/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/yourusername/dreamcatcher/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/yourusername/dreamcatcher/releases/tag/v1.0.0
