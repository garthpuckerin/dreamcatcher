# Changelog

All notable changes to the Dreamcatcher project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Browser extension integration
- Cloud sync with Supabase (v2.2)
- AI-powered document parsing
- Drag-and-drop file attachments

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

[Unreleased]: https://github.com/yourusername/dreamcatcher/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/yourusername/dreamcatcher/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/yourusername/dreamcatcher/releases/tag/v1.0.0
