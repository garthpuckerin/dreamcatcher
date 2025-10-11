# 📱 Dreamcatcher Mobile App - Planning Document

## Overview

Native mobile apps for iOS and Android to enable capturing and managing dreams/fragments on the go.

---

## 🎯 Goals

### Primary Goals
- **Quick Capture** - Capture ideas/conversations instantly from mobile
- **On-the-Go Access** - View and organize dreams anywhere
- **Seamless Sync** - Sync with web app and desktop
- **Native Feel** - True native mobile experience

### Secondary Goals
- Voice-to-text quick capture
- Screenshot capture and annotation
- Share extension (capture from any app)
- Offline-first with sync when online
- Push notifications for updates

---

## 🗺️ Mobile Roadmap (Phase 6)

### Phase 6.1: Foundation
- [ ] Choose tech stack (React Native vs Native)
- [ ] Set up development environment
- [ ] Create mobile UI designs
- [ ] Implement authentication
- [ ] Basic CRUD operations (Dreams/Fragments)
- [ ] Local storage (SQLite/Realm)

### Phase 6.2: Core Features
- [ ] List view with search/filter
- [ ] Dream detail view
- [ ] Fragment creation/editing
- [ ] Markdown support
- [ ] Tag management
- [ ] Status tracking
- [ ] Offline mode

### Phase 6.3: Cloud Sync
- [ ] Backend API development
- [ ] Real-time sync
- [ ] Conflict resolution
- [ ] Background sync
- [ ] Sync status indicators

### Phase 6.4: Advanced Capture
- [ ] Voice-to-text capture
- [ ] Camera/screenshot integration
- [ ] Share extension (iOS)
- [ ] Share intent (Android)
- [ ] Quick actions/shortcuts
- [ ] Widget support

### Phase 6.5: Polish & Launch
- [ ] Performance optimization
- [ ] Accessibility features
- [ ] Dark/light themes
- [ ] Haptic feedback
- [ ] Animation polish
- [ ] Beta testing
- [ ] App Store submission
- [ ] Google Play submission

---

## 🔧 Technology Options

### Option 1: React Native (Recommended)
**Pros:**
- ✅ Code reuse with web app (React)
- ✅ Single codebase for iOS & Android
- ✅ Large ecosystem & community
- ✅ Faster development
- ✅ Expo for easier setup
- ✅ Hot reload for quick iteration

**Cons:**
- ⚠️ Slightly larger app size
- ⚠️ Some native features require bridges
- ⚠️ Performance not quite native

**Best For:** MVP, rapid development, cross-platform

### Option 2: Flutter
**Pros:**
- ✅ Beautiful UI out of the box
- ✅ Excellent performance
- ✅ Single codebase
- ✅ Rich widget library

**Cons:**
- ⚠️ Dart language (new to learn)
- ⚠️ Can't reuse React code
- ⚠️ Larger initial learning curve

**Best For:** Performance-critical apps, custom UI

### Option 3: Native (Swift + Kotlin)
**Pros:**
- ✅ Best performance
- ✅ Full platform features
- ✅ Best user experience
- ✅ Platform-specific optimizations

**Cons:**
- ⚠️ Two separate codebases
- ⚠️ 2x development time
- ⚠️ 2x maintenance cost
- ⚠️ Requires two skill sets

**Best For:** Production apps with large user base

---

## 📊 Recommended Approach

### Phase 6 Strategy: React Native

1. **Start with React Native + Expo**
   - Leverage existing React knowledge
   - Share component logic with web app
   - Rapid prototyping and iteration
   - Easy to eject to bare workflow if needed

2. **Progressive Enhancement**
   - Start with core features
   - Add native modules as needed
   - Optimize performance iteratively
   - Consider native rewrite if app grows significantly

3. **Shared Architecture**
   - Shared data models with web app
   - Shared business logic
   - Platform-specific UI components
   - Consistent design language

---

## 🏗️ Architecture

### Tech Stack
```
Frontend (React Native)
├── React Native 0.72+
├── Expo (managed workflow initially)
├── React Navigation (routing)
├── Zustand or Redux (state management)
├── React Query (API/sync)
├── Async Storage (local cache)
└── SQLite/Realm (offline storage)

Backend (Optional Cloud Sync)
├── Node.js + Express or Fastify
├── PostgreSQL or MongoDB
├── JWT authentication
├── WebSockets for real-time
├── Cloud storage (AWS S3/Cloudflare R2)
└── Push notifications (FCM/APNs)

Services
├── Firebase (optional - auth, sync, push)
├── Supabase (alternative)
└── AWS Amplify (alternative)
```

### Data Flow
```
Mobile App
    ↓
Local Storage (SQLite/Realm)
    ↓
Sync Service
    ↓
Cloud Backend (optional)
    ↓
Web App + Desktop App
```

---

## 🎨 UI/UX Design

### Key Screens

1. **Home/Dreams List**
   - Search bar at top
   - Filter chips (status)
   - Card-based dream list
   - FAB for quick capture
   - Bottom navigation

2. **Dream Detail**
   - Header with title/status
   - Tabs: Consolidated, Timeline, Fragments
   - Edit/delete actions
   - Add fragment FAB

3. **Fragment View**
   - Full screen reading mode
   - Syntax highlighting for code
   - Feature tags
   - Share/export options

4. **Quick Capture**
   - Modal from anywhere
   - Voice input option
   - Auto-save draft
   - Smart dream suggestion

5. **Settings**
   - Sync preferences
   - Theme selection
   - Notification settings
   - Data management (export/import)

### Design Principles
- **Mobile-first** - Optimize for one-handed use
- **Gesture-driven** - Swipe actions, pull to refresh
- **Fast access** - Quick capture from anywhere
- **Offline-capable** - Work without internet
- **Battery-conscious** - Efficient background sync

---

## 🔌 Key Features

### MVP Features (Must Have)
- ✅ View all dreams
- ✅ View dream details
- ✅ Create/edit dreams
- ✅ Create/edit fragments
- ✅ Search functionality
- ✅ Basic offline support
- ✅ Import/export JSON

### Phase 2 Features
- 🔄 Cloud sync
- 🔄 Real-time updates
- 🔄 Voice-to-text capture
- 🔄 Dark mode
- 🔄 Push notifications

### Phase 3 Features (Nice to Have)
- 📱 Widget support
- 📱 Share extension
- 📱 Camera capture
- 📱 Biometric security
- 📱 Collaborative features

---

## 🔐 Security & Privacy

### Local Storage
- Encrypted local database (optional)
- Biometric lock (Face ID, Touch ID)
- Auto-lock after inactivity

### Cloud Sync (if implemented)
- End-to-end encryption
- Zero-knowledge architecture
- User owns their data
- Optional cloud sync (can stay local-only)

---

## 📈 Performance Targets

- **App Size:** < 50MB
- **Launch Time:** < 2 seconds
- **UI Response:** < 100ms
- **Sync Time:** < 5 seconds for typical dataset
- **Battery Usage:** < 2% per hour (background)
- **Offline Mode:** Full functionality

---

## 🚀 Launch Strategy

### Beta Testing
1. **Internal Testing**
   - Team members
   - Core features validation
   - Bug fixes

2. **Alpha Testing**
   - TestFlight (iOS)
   - Google Play Internal Testing
   - 10-20 users
   - Feedback collection

3. **Public Beta**
   - Open beta via TestFlight/Play Store
   - 100-500 users
   - Performance monitoring
   - Crash reporting

### App Store Submission
- **iOS:** Apple App Store
  - Developer account ($99/year)
  - App Review (1-3 days)
  - Screenshots, description, keywords

- **Android:** Google Play Store
  - Developer account ($25 one-time)
  - Review (few hours)
  - Screenshots, description, listing

---

## 💰 Monetization (Optional)

### Free Tier
- Basic features
- Local storage only
- Manual import/export
- Ad-supported (optional)

### Premium Tier ($4.99/month or $49.99/year)
- Cloud sync
- Unlimited dreams/fragments
- Advanced features
- Priority support
- No ads

### One-Time Purchase
- $29.99 lifetime access
- All features unlocked
- One-time payment

---

## 📅 Timeline Estimate

### React Native Approach
- **Phase 6.1 (Foundation):** 4-6 weeks
- **Phase 6.2 (Core Features):** 6-8 weeks
- **Phase 6.3 (Cloud Sync):** 4-6 weeks
- **Phase 6.4 (Advanced Capture):** 4-6 weeks
- **Phase 6.5 (Polish & Launch):** 4-6 weeks

**Total:** ~5-7 months for full featured app

### MVP Only
- **Basic app with offline support:** 2-3 months
- **Beta testing:** 2-4 weeks
- **Launch:** 1-2 weeks

---

## 🎯 Success Metrics

### Technical Metrics
- Crash-free rate > 99.5%
- App rating > 4.5 stars
- Launch time < 2 seconds
- Sync success rate > 99%

### User Metrics
- Daily active users
- Dreams created per user
- Fragments captured per day
- Retention rate (Day 1, Day 7, Day 30)

---

## 🔄 Integration with Ecosystem

### Current Platform Integration
```
Browser Extension ←→ Web App ←→ Desktop App ←→ Mobile App
                      ↓
                 Cloud Sync (optional)
```

### Data Sync Strategy
1. Each platform can work standalone
2. Optional cloud sync connects all platforms
3. Conflict resolution (last-write-wins or merge)
4. Real-time updates via WebSockets (optional)

---

## 📚 Resources Needed

### Development
- React Native developer (or full-stack with RN experience)
- UI/UX designer for mobile
- Backend developer (if cloud sync)
- QA tester

### Tools & Services
- Developer accounts (Apple + Google)
- Design tools (Figma)
- CI/CD (GitHub Actions, Bitrise)
- Analytics (Firebase, Mixpanel)
- Crash reporting (Sentry, Crashlytics)
- Backend hosting (if cloud)

---

## 🎓 Learning Resources

### React Native
- https://reactnative.dev/docs/getting-started
- https://docs.expo.dev/
- React Native Radio podcast
- William Candillon YouTube channel

### Mobile Design
- Apple HIG (Human Interface Guidelines)
- Material Design (Android)
- Mobile Design Patterns

---

## ✅ Decision Points

### Before Starting Phase 6:
- [ ] Web app and desktop app stable
- [ ] User base requesting mobile app
- [ ] Resources available for development
- [ ] Cloud sync strategy decided
- [ ] Monetization strategy (if any)

### Tech Stack Decision:
- [ ] React Native (recommended for MVP)
- [ ] Flutter (if team has experience)
- [ ] Native (if budget allows 2 codebases)

---

## 📝 Notes

- Mobile app is Phase 6 - comes after cloud integration (Phase 4)
- Consider starting with React Native for speed
- Can always rewrite to native later if needed
- Focus on core value: quick capture on mobile
- Keep UI simple and fast
- Offline-first is critical for mobile

---

**Status:** Planning Phase  
**Priority:** Medium (after Phases 2-5)  
**Estimated Start:** Q3 2025  
**Target Launch:** Q1 2026  

---

**Last Updated:** October 11, 2025

