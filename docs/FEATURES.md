# Dreamcatcher Feature Documentation

Visual guide to all commercialization features with use cases and screenshots.

## Table of Contents

1. [Real-Time Collaboration](#1-real-time-collaboration)
2. [AI Chat Integration Extension](#2-ai-chat-integration-extension)
3. [Advanced AI Assistant](#3-advanced-ai-assistant)
4. [Timeline & Retrospectives](#4-timeline--retrospectives)
5. [Integration Ecosystem](#5-integration-ecosystem)
6. [Portfolio Builder](#6-portfolio-builder)
7. [Analytics Dashboard](#7-analytics-dashboard)
8. [Smart Templates & Marketplace](#8-smart-templates--marketplace)
9. [Mobile App](#9-mobile-app)
10. [Version Control for Ideas](#10-version-control-for-ideas)

---

## 1. Real-Time Collaboration

**Tier**: Teams ($49/mo)
**Status**: ✅ Implemented

### Overview
Enable multiple team members to work on the same dream simultaneously with live updates and presence tracking.

### Key Features

#### Live Co-Editing
- Multiple users can edit dreams simultaneously
- Changes appear in real-time for all participants
- Operational Transform prevents conflicts
- Sub-second latency with WebSocket

#### Presence Tracking
- See who's currently viewing/editing
- Active user indicators
- Online/offline status
- Last seen timestamps

#### Live Cursors
- Real-time cursor position updates
- Color-coded per user
- See what teammates are focusing on
- Smooth cursor animations

### Use Cases

**Product Team Sprint Planning**
```
Team: Product Manager, Designer, 2 Developers
Scenario: Planning next sprint
Result: All members simultaneously:
  - PM adds user stories
  - Designer adds wireframe fragments
  - Devs break down technical tasks
  - Changes sync in real-time
```

**Remote Brainstorming**
```
Team: Distributed startup team
Scenario: Brainstorming new features
Result: Ideas captured live, everyone contributes simultaneously
```

### Technical Details
- **Protocol**: WebSocket (Socket.io)
- **Scaling**: Redis pub/sub for multi-instance
- **Latency**: <200ms average
- **Max Users**: 50 per dream (configurable)

---

## 2. AI Chat Integration Extension

**Tier**: Pro ($15/mo)
**Status**: ✅ Implemented

### Overview
Browser extension that captures ChatGPT and Claude conversations with one click.

### Key Features

#### One-Click Capture
- Floating capture button on ChatGPT/Claude pages
- Extract entire conversation thread
- Automatic markdown formatting
- Preserve code blocks and formatting

#### Offline Queue
- Capture without internet
- Queue stored locally
- Auto-sync when online
- Resume interrupted uploads

#### Auto-Detection
- Detect project context from conversation
- Suggest relevant dream
- Extract topics and tags
- Smart categorization

#### Context Menu Integration
- Right-click any text to capture
- Select multiple messages
- Quick capture shortcut (Ctrl+Shift+D)
- Minimal UI disruption

### Use Cases

**Developer Learning**
```
User: Learning React from ChatGPT
Scenario: Having lengthy conversation about hooks
Action: Click capture → saves to "Learning React" dream
Result: All Q&A preserved for future reference
```

**Product Research**
```
User: Brainstorming with Claude
Scenario: Exploring product ideas
Action: Auto-capture enabled
Result: Every idea automatically saved
```

### Installation

```bash
1. Visit Chrome Web Store
2. Click "Add to Chrome"
3. Log in to Dreamcatcher
4. Start capturing!
```

### Browser Support
- ✅ Chrome/Edge (Chromium)
- ✅ Brave
- ⏳ Firefox (coming soon)
- ⏳ Safari (coming soon)

---

## 3. Advanced AI Assistant

**Tier**: Pro ($15/mo)
**Status**: ✅ Implemented

### Overview
AI-powered assistant that helps you prioritize, summarize, and analyze your dreams.

### Key Features

#### Task Prioritization
```
User asks: "What should I work on next?"

AI analyzes:
- Deadlines and urgency
- Dependencies between tasks
- Recent momentum
- Strategic importance

Result: "Focus on 'Launch MVP' - deadline in 3 days,
         blocks 2 other dreams, high impact"
```

#### Progress Summaries
```
Frequency: Daily, weekly, monthly
Generated: Automatically or on-demand

Example Weekly Summary:
"This week you captured 12 fragments, completed 8 todos,
and made significant progress on 'Build SaaS Product'.
Key milestones: Finished authentication, deployed beta."
```

#### Similarity Detection
```
Current dream: "E-commerce Platform"

AI finds similar past dreams:
- "Online Store Prototype" (80% similar)
- "Marketplace MVP" (65% similar)

Suggestions: "Reuse authentication from Online Store,
             avoid mistakes from Marketplace MVP"
```

#### Task Breakdown
```
Input: "Build landing page"

AI generates:
1. Design mockup (planning)
2. Create HTML structure (coding)
3. Add responsive CSS (coding)
4. Implement contact form (coding)
5. Set up analytics (admin)
6. Deploy to Vercel (admin)
```

#### Risk Detection
```
Dream: "Simple CRUD App"

Fragments show:
- "Adding AI recommendations"
- "Building blockchain integration"
- "Real-time collaboration needed"

AI warns: "⚠️ Scope creep detected! Original goal was
          simple CRUD, but scope has expanded 3x."
```

#### Meeting Parser
```
Input: Meeting transcript

AI extracts:
- Sarah: Design landing page by Friday
- Mike: Set up database migrations
- Team: Review mockups at next standup

Creates: 3 todos automatically assigned
```

#### Code Analysis
```
Fragments with code:
```javascript
function authenticate(user) { ... }
function sendEmail(to, subject) { ... }
```

AI detects:
- Authentication system (JavaScript)
- Email functionality (Python)
- Suggests: "Add password reset flow"
```

### Pricing
- Included in Pro tier
- AI credits: 100/month
- Additional credits: $0.10 per 10 queries

---

## 4. Timeline & Retrospectives

**Tier**: Pro ($15/mo)
**Status**: ✅ Implemented

### Overview
Visualize dream evolution and conduct data-driven retrospectives.

### Key Features

#### Visual Timeline
```
┌─────────────────────────────────────────────────────┐
│  Dream: "Launch SaaS Product"                      │
│  Duration: 45 days                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🎯 Started ───── 💡 Pivot ───── 🚀 Launched       │
│    Jan 1         Jan 15         Feb 14            │
│                                                     │
│  Activity: ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁                      │
└─────────────────────────────────────────────────────┘
```

#### Activity Heatmap
```
Less   ░░▒▒▓▓██   More
       Jan  Feb  Mar
```

#### Auto-Detected Milestones
- **Started**: Dream created
- **Launched**: "deployed", "released" keywords
- **Pivoted**: "changed direction", "pivot"
- **Blocked**: "stuck", "blocker", "issue"
- **Completed**: Status changed to completed

#### Retrospective Formats

**1. Start-Stop-Continue**
```
START:
- Daily standups
- Code reviews

STOP:
- Over-engineering
- Context switching

CONTINUE:
- Pair programming
- Weekly demos
```

**2. 4 Ls (Liked, Learned, Lacked, Longed For)**
```
LIKED:
- Fast iteration speed
- Team collaboration

LEARNED:
- TypeScript best practices
- CI/CD pipelines

LACKED:
- Design resources
- QA process

LONGED FOR:
- Better documentation
- More time for refactoring
```

**3. Sailboat**
```
WIND (helping): ⛵
- Clear requirements
- Supportive team

ANCHORS (blocking): ⚓
- Technical debt
- Slow CI

ROCKS (risks): 🪨
- Scope creep
- Timeline pressure

ISLAND (goal): 🏝️
- Successful product launch
```

**4. Mad-Sad-Glad**
```
MAD 😠:
- Unclear requirements
- Last-minute changes

SAD 😢:
- Missed deadline
- Cut features

GLAD 😊:
- Launched successfully
- Team growth
```

#### AI-Powered Suggestions
AI analyzes fragments and suggests retrospective items:
```
"Based on your fragments, I noticed:
- 3 mentions of 'technical debt' → Add to 'Lacked'
- 2 successful launches → Add to 'Glad'
- 1 pivot → Add to 'Learned'"
```

#### Export Options
- PDF with full timeline
- PNG image of timeline
- CSV data for analysis
- Markdown format

### Use Cases

**Post-Launch Review**
```
Dream: "Mobile App Launch"
Timeline: 60 days, 3 milestones
Retrospective: 4 Ls format
Outcome: Identified 5 process improvements
```

**Sprint Retrospective**
```
Dream: "Q1 Features"
Timeline: 2 weeks, daily activity
Retrospective: Start-Stop-Continue
Outcome: Team alignment on practices
```

---

## 5. Integration Ecosystem

**Tier**: Teams ($49/mo)
**Status**: ✅ Implemented

### Overview
Connect Dreamcatcher with your existing tools for seamless workflow integration.

### Supported Integrations

#### GitHub Integration

**Auto-Capture Commits**
```
Event: Git push
Action: Creates fragments from commits
Result:
  Fragment: "feat: add authentication"
  Content: Commit message + changed files
  Type: commit
  Link: GitHub commit URL
```

**Pull Requests → Fragments**
```
Event: PR opened/closed
Action: Create fragment with PR details
Result:
  Fragment: "PR #42: Add dark mode"
  Content: PR description + status
  Type: pull_request
```

**Issues → Todos**
```
Event: GitHub issue created
Action: Create todo in relevant dream
Result:
  Todo: "Fix login bug"
  Category: coding
  Link: GitHub issue URL
```

**Setup**
```bash
1. Settings → Integrations → GitHub
2. Click "Connect GitHub"
3. Authorize Dreamcatcher
4. Select repositories
5. Configure webhooks automatically
```

#### Slack Integration

**Thread Capture**
```
In Slack:
1. Right-click any thread
2. "Send to Dreamcatcher"
3. Select dream
4. Thread saved as fragment
```

**Notifications**
```
Triggers:
- Dream deadline approaching
- Todo assigned to you
- Team member mentions dream
- Milestone reached

Slack message:
"💭 Reminder: 'Launch MVP' deadline in 2 days
 📊 Progress: 8/10 todos complete
 👉 View: https://app.dreamcatcher.com/dreams/123"
```

**Bot Commands**
```
/dreamcatcher capture "Quick idea"
/dreamcatcher list dreams
/dreamcatcher status "MVP Launch"
```

#### Google Calendar Integration

**Auto-Sync Deadlines**
```
Todo with deadline → Google Calendar event
- Event title: [Dreamcatcher] {todo title}
- Description: Dream name + todo details
- Reminder: 1 day before
- Color: Purple (configurable)
```

**Bidirectional Sync**
```
Calendar → Dreamcatcher:
- Create todo from calendar event
- Tag: [Dreamcatcher] in title

Dreamcatcher → Calendar:
- Auto-update when deadline changes
- Delete event when todo completed
```

### OAuth Flow

```
1. Click "Connect {Service}"
2. Redirect to service OAuth page
3. Grant permissions
4. Redirect back to Dreamcatcher
5. Access token stored securely
6. Integration active!
```

### Security
- OAuth 2.0 standard
- Tokens encrypted at rest
- Minimal permission scopes
- Revocable anytime
- Activity audit log

---

## 6. Portfolio Builder

**Tier**: Pro ($15/mo)
**Status**: ✅ Implemented

### Overview
Create beautiful public portfolio pages showcasing your completed dreams.

### Key Features

#### Public Showcase Pages

**Example URL**: `https://dreamcatcher.app/johndoe`

```
┌──────────────────────────────────────┐
│  John Doe's Portfolio                │
│  Full-stack developer & PM           │
├──────────────────────────────────────┤
│                                      │
│  Skills: React, Node.js, Python     │
│         Product Management          │
│                                      │
│  ┌──────────────┐ ┌──────────────┐ │
│  │ E-commerce   │ │ SaaS         │ │
│  │ Platform     │ │ Dashboard    │ │
│  │ ⭐⭐⭐⭐⭐ │ │ ⭐⭐⭐⭐   │ │
│  └──────────────┘ └──────────────┘ │
└──────────────────────────────────────┘
```

#### AI-Generated Case Studies

**7 Sections:**
1. **Overview**: 2-3 sentence summary
2. **Problem Statement**: What problem was solved
3. **Solution**: How it was solved
4. **Process & Timeline**: Development journey
5. **Challenges**: Obstacles overcome
6. **Results & Impact**: Outcomes achieved
7. **Key Learnings**: Insights gained

**Example:**
```
## E-commerce Platform

### Overview
Built a full-stack e-commerce platform enabling small
businesses to sell online with integrated payment
processing and inventory management.

### Problem Statement
Small businesses struggled with expensive e-commerce
solutions. Existing platforms were either too simple
or too complex, with high monthly fees.

### Solution
Developed a React/Node.js platform with:
- Stripe payment integration
- Real-time inventory tracking
- Customer analytics dashboard
- Mobile-responsive design

### Process & Timeline
- Week 1-2: Requirements & design
- Week 3-4: Backend API development
- Week 5-6: Frontend implementation
- Week 7-8: Testing & launch

### Challenges
- Payment processing compliance (PCI-DSS)
- Real-time inventory synchronization
- Mobile performance optimization

### Results & Impact
- 50+ businesses onboarded in first month
- $100K+ in transactions processed
- 4.8/5 average customer rating

### Key Learnings
- Start with payment compliance early
- Mobile-first design is crucial
- User feedback drives feature priority
```

#### Custom Themes

**Minimal**
```css
--primary: #1a202c
--secondary: #718096
--accent: #667eea
--bg: #ffffff
```

**Vibrant**
```css
--primary: #9333ea
--secondary: #ec4899
--accent: #f59e0b
--bg: #faf5ff
```

**Professional**
```css
--primary: #1e40af
--secondary: #64748b
--accent: #0891b2
--bg: #f8fafc
```

**Dark Mode**
```css
--primary: #f9fafb
--secondary: #9ca3af
--accent: #8b5cf6
--bg: #1a202c
```

#### Skills Tracking
```
Auto-extracted from dreams:
- Programming languages used
- Frameworks mentioned
- Tools and technologies
- Soft skills (from retrospectives)

Display as tag cloud or list
```

#### Custom Domain
```
Pro feature: portfolio.yourdomain.com

Setup:
1. Add CNAME: portfolio → dreamcatcher.app
2. Settings → Portfolio → Custom Domain
3. Enter: portfolio.yourdomain.com
4. Verify DNS
5. SSL auto-provisioned
```

#### SEO Optimization
```html
<!-- Auto-generated meta tags -->
<title>John Doe - Full-stack Developer Portfolio</title>
<meta name="description" content="Portfolio of completed projects...">
<meta property="og:title" content="John Doe's Portfolio">
<meta property="og:image" content="preview-image.png">

<!-- JSON-LD structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "John Doe",
  "jobTitle": "Full-stack Developer",
  "url": "https://dreamcatcher.app/johndoe"
}
</script>
```

---

## 7. Analytics Dashboard

**Tier**: Pro ($15/mo)
**Status**: ✅ Implemented

### Overview
Comprehensive metrics and insights into your productivity and progress.

### Key Metrics

#### Dream Velocity
```
┌─────────────────────────────────────┐
│  Dream Velocity (Days to Complete) │
├─────────────────────────────────────┤
│                                     │
│  Average:  14 days  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  Fastest:   7 days  ▓▓▓▓▓▓▓        │
│  Slowest:  21 days  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                                     │
│  Based on 15 completed dreams       │
└─────────────────────────────────────┘
```

#### Fragment Frequency
```
Fragments per Day:   2.3
Fragments per Week: 16.1
Total Fragments:    450

Trend: ↗️ +15% vs last month
```

#### Productivity Trends
```
Fragments & Tasks Over Time

20 ┤     ╭─╮
15 ┤   ╭─╯ ╰─╮     ╭─╮
10 ┤ ╭─╯     ╰─╮ ╭─╯ │
 5 ┤─╯         ╰─╯   │
 0 ┴──────────────────┴─
   Week 1  2  3  4  5

Legend: ─── Fragments  ··· Tasks
```

#### AI Usage Stats
```
Total AI Queries:     127
By Feature:
  - Task Prioritization:  42
  - Progress Summary:     28
  - Similar Projects:     19
  - Task Breakdown:       18
  - Risk Detection:       12
  - Code Analysis:         8

Last Used: 2 hours ago
Credits Remaining: 73/100
```

#### Dreams by Status
```
Status Distribution:
━━━━━━━━━━ In Progress (40%)
━━━━━      Completed   (25%)
━━━        Idea        (15%)
━━━━       Launched    (20%)

Completion Rate: 45%
```

### Insights

**High Activity**
```
🔥 Great work! You're capturing 2.3 fragments per day.
   Keep up the momentum!
```

**Fast Execution**
```
⚡ Your average completion time is 14 days.
   You're executing quickly!
```

**Too Many Active Dreams**
```
⚠️ You have 12 active dreams. Consider focusing on
   fewer projects for better results.
```

**Low Completion Rate**
```
🎯 Only 45% of dreams are completed. Focus on
   finishing existing dreams before starting new ones.
```

**Infrequent Capture**
```
📝 You're capturing <0.5 fragments per day.
   Try capturing more frequently to maintain momentum.
```

### Export
```
Format: CSV
Contains:
- All metrics and values
- Time-series data
- Trend calculations

Use for:
- Personal analysis
- Team reports
- Performance reviews
```

---

## 8. Smart Templates & Marketplace

**Tier**: All tiers (Free, Pro, Teams)
**Status**: ✅ Implemented

### Overview
Browse, use, and sell dream templates to kickstart projects.

### Built-in Templates

#### MVP Launch Checklist
```
Category: Product
Price: Free
Rating: ⭐⭐⭐⭐⭐ 4.8/5
Uses: 1,234

Includes:
✅ 5 planning tasks
✅ 8 development tasks
✅ 6 marketing tasks
✅ 4 launch tasks

Dream: "MVP Launch"
Tags: mvp, launch, product
```

#### Side Project Starter
```
Category: Project
Price: Free
Rating: ⭐⭐⭐⭐ 4.5/5
Uses: 892

Includes:
✅ Idea validation tasks
✅ Tech stack selection
✅ Basic dev workflow
✅ First user acquisition

Dream: "Side Project"
Tags: side-project, indie-hacking
```

### Template Marketplace

**Discover Templates**
```
Browse by:
- Category (Product, Project, Personal, Business, Learning)
- Price (Free, Paid)
- Rating (5 stars → 1 star)
- Popularity (Most used)
- Recent (Newly added)

Search: "startup launch"
Results: 47 templates found
```

**Template Preview**
```
┌──────────────────────────────────────┐
│  Startup Launch Playbook             │
│  By @sarahfounder · $9.99            │
│  ⭐⭐⭐⭐⭐ 4.9 · 2,341 uses         │
├──────────────────────────────────────┤
│                                      │
│  Complete playbook for launching     │
│  your startup from idea to first     │
│  1000 users.                         │
│                                      │
│  ✓ 42 tasks                          │
│  ✓ Pre-launch checklist              │
│  ✓ Launch day runbook                │
│  ✓ Post-launch growth tactics        │
│                                      │
│  [ Preview ] [ Purchase $9.99 ]      │
└──────────────────────────────────────┘
```

### Create & Sell Templates

**Creator Dashboard**
```
Your Templates:
- "Product Roadmap Template" - $4.99
  💰 $243.60 earned (35 sales)

- "Sprint Planning Template" - Free
  👥 892 uses

Total Earnings: $243.60
Pending Payout: $87.20
```

**Marketplace Commission**
```
Sale Price:      $9.99
Your Earnings:   $6.99 (70%)
Platform Fee:    $3.00 (30%)

Payment: Monthly via Stripe
Minimum Payout: $25
```

**Template Creation**
```
1. Complete a dream you're proud of
2. Click "Create Template"
3. Add description & category
4. Set price (free or $1-$99)
5. Review & publish
6. Earn from sales!
```

### One-Click Apply
```
User clicks "Use Template"
→ Creates new dream with:
  - Template title (editable)
  - All template todos
  - Template tags
  - Template description

User customizes and starts working!
```

---

## 9. Mobile App

**Tier**: All tiers
**Status**: ✅ Implemented

### Overview
Native iOS and Android app for capturing ideas on the go.

### Key Features

#### Quick Capture
```
┌─────────────────────────────┐
│  💭 Quick Capture           │
├─────────────────────────────┤
│                             │
│  Select Dream:              │
│  [ Launch MVP  ▼ ]          │
│                             │
│  Title:                     │
│  [Great pricing idea____]   │
│                             │
│  Content:                   │
│  ┌─────────────────────┐   │
│  │Freemium with Pro tier│   │
│  │at $15/month. Free   │   │
│  │tier gets 10 dreams. │   │
│  └─────────────────────┘   │
│                             │
│  [  💭 Capture  ]           │
└─────────────────────────────┘

Speed: 3 taps, 10 seconds
```

#### Offline Support
```
1. Capture fragment (no internet)
2. Queued locally
3. Badge shows "1 pending"
4. Auto-syncs when online
5. Success notification

Queue persistance:
- Survives app restart
- Retry on failure
- Background sync
```

#### Home Dashboard
```
┌─────────────────────────────┐
│  💭 Dreamcatcher            │
├─────────────────────────────┤
│                             │
│  🎯 5 Active Dreams         │
│  💭 128 Total Fragments     │
│  ✅ 42 Tasks Completed      │
│                             │
│  🔄 Synced 2 min ago        │
│                             │
│  Recent Captures:           │
│  • Great pricing idea       │
│  • User feedback notes      │
│  • Bug fix reminder         │
│                             │
│  [  💭 Quick Capture  ]     │
└─────────────────────────────┘
```

#### Photo Capture
```
Use camera to:
1. Capture whiteboard notes
2. Photo of sticky notes
3. Screenshot of inspiration
4. Product mockup photo

Attached to fragment
OCR extracts text (Pro feature)
```

#### Push Notifications
```
Triggers:
- 📅 Deadline in 1 day
- ✅ Teammate completed todo
- 💬 Mention in dream
- 🎯 Milestone reached

Settings:
- Customize triggers
- Quiet hours
- Per-dream config
```

### Platform Support

**iOS**
- iOS 14+
- iPhone & iPad
- Dark mode
- Widget support
- Shortcuts integration

**Android**
- Android 8+
- Material Design 3
- Dark mode
- Home screen widgets

---

## 10. Version Control for Ideas

**Tier**: Pro ($15/mo)
**Status**: ✅ Implemented

### Overview
Git-like version control for your dreams - snapshot, restore, diff, and branch.

### Key Features

#### Snapshots
```
Create Snapshot:
1. Click "Create Snapshot"
2. Add message: "Before pivot"
3. Snapshot created

Snapshot contains:
- Complete dream state
- All todos
- All fragments
- Metadata
- Timestamp
```

#### Restore
```
View History:
┌──────────────────────────────┐
│  Version History             │
├──────────────────────────────┤
│                              │
│  ○ After user feedback       │
│    2 hours ago               │
│                              │
│  ○ Pivoted to B2B           │
│    1 day ago                 │
│                              │
│  ● Before pivot              │
│    3 days ago       [Restore]│
│                              │
│  ○ Initial version           │
│    1 week ago                │
└──────────────────────────────┘

Restore:
- One-click restore
- Creates new "Restored from..." tag
- Original preserved
```

#### Diff View
```
Compare: "Before pivot" vs "After user feedback"

Changes:
+ Added: "Enterprise features" section
+ Added: 3 new todos
- Removed: "Consumer pricing" section
~ Modified: Title "App" → "B2B SaaS"

┌─────────────────┬─────────────────┐
│  Before         │  After          │
├─────────────────┼─────────────────┤
│ Consumer App    │ B2B SaaS        │
│ $5/month        │ $50/month       │
│ Individuals     │ Teams           │
└─────────────────┴─────────────────┘
```

#### Branch
```
Create Branch:
1. Click "Branch Dream"
2. Name: "Explore B2C direction"
3. Branch created

Result:
- New dream created
- Identical starting point
- Independent development
- Original unchanged

Use for:
- A/B testing ideas
- Exploring alternatives
- Risk-free experimentation
```

#### Change Log
```
┌──────────────────────────────────┐
│  Change Log                      │
├──────────────────────────────────┤
│                                  │
│  Feb 14, 2024 - Sarah            │
│  Pivoted to B2B                  │
│  ───────────────────────────     │
│  User research showed enterprise │
│  need. Changed target market.    │
│                                  │
│  Feb 10, 2024 - Team             │
│  Added enterprise features       │
│  ───────────────────────────     │
│  SSO, audit logs, RBAC          │
│                                  │
│  Feb 1, 2024 - Sarah             │
│  Initial version                 │
│  ───────────────────────────     │
│  Created dream for consumer app  │
└──────────────────────────────────┘
```

### Use Cases

**Before Major Pivot**
```
Snapshot: "Before B2B pivot"
Reason: Safety net if pivot fails
Result: Can restore if needed
```

**A/B Testing**
```
Original: "SaaS Dashboard"
Branch A: "Explore freemium model"
Branch B: "Explore enterprise-only"
Test both, merge winner
```

**Milestone Documentation**
```
Snapshots at:
- MVP complete
- Beta launch
- V1.0 release
- Major feature adds

Creates timeline of evolution
```

---

## Pricing Summary

| Feature | Free | Pro ($15/mo) | Teams ($49/mo) | Enterprise |
|---------|------|--------------|----------------|------------|
| Dreams | 10 | Unlimited | Unlimited | Unlimited |
| AI Chat Extension | ✅ | ✅ | ✅ | ✅ |
| AI Assistant | - | ✅ | ✅ | ✅ |
| Timeline & Retros | - | ✅ | ✅ | ✅ |
| Analytics | Basic | Advanced | Advanced | Custom |
| Portfolio | - | ✅ | ✅ | ✅ |
| Templates | Browse | Buy & Sell | Buy & Sell | Custom |
| Version Control | - | ✅ | ✅ | ✅ |
| Mobile App | ✅ | ✅ | ✅ | ✅ |
| Real-time Collab | - | - | ✅ | ✅ |
| Integrations | - | - | ✅ | ✅ |
| SSO | - | - | - | ✅ |
| SLA | - | - | - | ✅ |

---

## Getting Started

1. **Sign up**: https://dreamcatcher.app/signup
2. **Choose tier**: Free to start, upgrade anytime
3. **Install extension**: Chrome Web Store
4. **Start capturing**: Your AI conversations await!

## Support

- **Docs**: https://docs.dreamcatcher.app
- **Email**: support@dreamcatcher.app
- **Chat**: In-app chat (Pro+)
- **Community**: Discord server

---

**Dreamcatcher - Turn ideas into reality, one feature at a time.** 🚀
