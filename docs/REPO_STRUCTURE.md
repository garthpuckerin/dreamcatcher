# 📁 Dreamcatcher Repository Structure

## Current Organization (v2.1.0)

```
dreamcatcher/
├── 📄 Core Files
│   ├── README.md                      # Main project overview
│   ├── CHANGELOG.md                   # Version history
│   ├── CONTRIBUTING.md                # Contribution guidelines
│   ├── package.json                   # Dependencies
│   ├── vite.config.js                 # Build configuration
│   └── index.html                     # Vite entry point
│
├── 📂 Source Code (src/)
│   ├── App_new.jsx                    # Main React component (v2.1.0)
│   ├── main.jsx                       # React entry point
│   └── index.css                      # Global styles
│
├── 📂 Documentation (docs/)
│   ├── README.md                      # Documentation hub
│   │
│   ├── 📋 planning/                   # Project Planning
│   │   ├── PROJECT_PLAN.md            # 6-phase development roadmap
│   │   ├── MOBILE_APP_PLAN.md         # Phase 6: Native apps
│   │   ├── PHASE_6_SUMMARY.md         # Mobile app details
│   │   └── SUPABASE_MIGRATION_PLAN.md # Backend migration plan
│   │
│   ├── 🔧 setup/                      # Setup & Installation
│   │   ├── QUICK_SETUP.md             # Quick start guide
│   │   ├── SETUP_COMPLETE.md          # Initial setup report
│   │   ├── REPO_SETUP_COMPLETE.md     # Git repository setup
│   │   ├── GITHUB_SETUP_COMPLETE.md   # GitHub integration
│   │   ├── SETUP_GIT_FLOW.md          # Git workflow
│   │   └── FIX_VITE_ERROR.md          # Common issues
│   │
│   ├── 🏗️ architecture/              # Technical Design
│   │   ├── ECOSYSTEM_VISION.md        # Complete ecosystem
│   │   ├── UI_UPDATE_SUMMARY.md       # UI version history
│   │   └── IMPLEMENTATION_COMPLETE.md # Implementation milestones
│   │
│   ├── 📢 marketing/                  # Marketing & Launch
│   │   ├── BRAND_STRUCTURE.md         # Brand architecture
│   │   ├── LAUNCH_CHECKLIST.md        # Launch preparation
│   │   ├── THE_REAL_STORY.md          # Marketing narrative
│   │   ├── TEASER_SITE_UPDATE.md      # Teaser site plan
│   │   └── REAL_DREAMS_DEMO.json      # Demo data
│   │
│   └── 📝 sessions/                   # Development Logs
│       └── SESSION_SUMMARY.md         # Session notes
│
├── 📂 Scripts (scripts/)
│   ├── README.md                      # Script documentation
│   ├── setup.bat                      # Initial setup
│   ├── setup-git.bat                  # Git initialization (CMD)
│   ├── setup-git.ps1                  # Git initialization (PowerShell)
│   └── start-dev.bat                  # Start dev server
│
├── 📂 Archive (archive/)
│   ├── App.v1.0.0.jsx                 # v1.0.0 UI backup
│   ├── VERSION_2.0.0_PLAN.md          # v2.0.0 plan
│   └── V2_VERIFICATION_CHECKLIST.md   # v2.0.0 tests
│
├── 📂 Teaser Site (teaser-site/)
│   ├── index.html                     # Landing page
│   ├── styles.css                     # Teaser styles
│   └── README.md                      # Deployment guide
│
├── 📂 GitHub Templates (.github/)
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md              # Bug report template
│   │   └── feature_request.md         # Feature request template
│   └── PULL_REQUEST_TEMPLATE.md       # PR template
│
└── 📂 Dependencies
    └── node_modules/                  # npm packages (git ignored)
```

---

## 📋 File Categories

### Essential Files (Keep in Root)
- `README.md` - First thing visitors see
- `CHANGELOG.md` - Version history
- `CONTRIBUTING.md` - Contribution guidelines
- `package.json` - Project metadata
- `LICENSE` - Project license
- `.gitignore` - Git exclusions

### Documentation (docs/)
Organized by purpose:
- **planning/** - What we're building
- **setup/** - How to get started
- **architecture/** - How it works
- **marketing/** - How we're launching
- **sessions/** - Development history

### Scripts (scripts/)
All utility scripts with their own README

### Archive (archive/)
Historical versions and deprecated docs

---

## 🗺️ Navigation Guide

### For New Users
1. [README.md](README.md) - Start here
2. [docs/setup/QUICK_SETUP.md](docs/setup/QUICK_SETUP.md) - Get running
3. [CONTRIBUTING.md](CONTRIBUTING.md) - Contribute

### For Contributors
1. [CONTRIBUTING.md](CONTRIBUTING.md) - Guidelines
2. [docs/setup/SETUP_GIT_FLOW.md](docs/setup/SETUP_GIT_FLOW.md) - Git workflow
3. [CHANGELOG.md](CHANGELOG.md) - Version history

### For Product Understanding
1. [docs/architecture/ECOSYSTEM_VISION.md](docs/architecture/ECOSYSTEM_VISION.md) - Big picture
2. [docs/planning/PROJECT_PLAN.md](docs/planning/PROJECT_PLAN.md) - Roadmap
3. [docs/marketing/BRAND_STRUCTURE.md](docs/marketing/BRAND_STRUCTURE.md) - Positioning

### For Development
1. [docs/planning/PROJECT_PLAN.md](docs/planning/PROJECT_PLAN.md) - What to build
2. [src/](src/) - Code to edit
3. [scripts/start-dev.bat](scripts/start-dev.bat) - Run locally

---

## 🔍 Finding Specific Information

### Setup & Installation
📁 `docs/setup/`

### Feature Roadmap
📄 `docs/planning/PROJECT_PLAN.md`

### Architecture & Design
📁 `docs/architecture/`

### Marketing & Launch
📁 `docs/marketing/`

### Version History
📄 `CHANGELOG.md`

### Contributing
📄 `CONTRIBUTING.md`

### Scripts & Utilities
📁 `scripts/`

---

## 📊 Repository Statistics

**Total Documentation Files**: 20+  
**Code Files**: 3 (src/)  
**Scripts**: 4  
**Archive Files**: 3  
**Templates**: 3 (.github/)  

**Documentation Categories**: 5  
**Well-Documented**: ✅ Yes  

---

## 🎯 Best Practices

### Adding New Documentation
1. Determine category (planning/setup/architecture/marketing/sessions)
2. Place in appropriate `docs/` subdirectory
3. Update `docs/README.md` index
4. Link from main `README.md` if essential

### Adding New Scripts
1. Place in `scripts/` directory
2. Add documentation to `scripts/README.md`
3. Make it executable
4. Add inline comments

### Versioning
1. Update `CHANGELOG.md` with changes
2. Increment version in `package.json`
3. Archive old versions if major UI changes

---

## 🔄 Git Workflow

**Branches**:
- `main` - Production
- `develop` - Integration
- `feature-2.2` - Active development

**Process**:
```
feature-2.2 → develop → main
```

See [docs/setup/SETUP_GIT_FLOW.md](docs/setup/SETUP_GIT_FLOW.md) for details.

---

## 📝 Documentation Standards

- **Markdown**: All docs in `.md` format
- **Emojis**: Use for visual scanning
- **Links**: Relative paths, not absolute
- **Updates**: Keep in sync with code
- **Archives**: Move old docs to `archive/`

---

## 🚀 Quick Commands

```bash
# Start development
.\scripts\start-dev.bat

# Install dependencies
npm install

# Build for production
npm run build

# Initialize Git
.\scripts\setup-git.ps1
```

---

*Repository structure last updated: 2025-10-12*  
*Version: 2.1.0*

