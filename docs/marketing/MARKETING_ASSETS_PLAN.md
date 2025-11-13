# Marketing Assets Creation Plan

## Overview
Automated creation of marketing materials using browser automation for Dreamcatcher website, Product Hunt, social media, and documentation.

---

## 🎯 Capabilities

### Screenshots ✅ **Available Now**
- **Static captures** of any page/component
- **High-resolution** PNG format
- **Full page** or specific elements
- **Responsive** sizes (desktop, tablet, mobile)

### Silent Demos ✅ **Available Now**
- **Video recordings** of user interactions
- **Animated workflows** showing features
- **No audio** - pure visual demonstration
- **MP4/WebM** format

### Interactive Demos 🔄 **Possible**
- **Automated user flows** captured as video
- **Smooth transitions** between features
- **Professional pacing** (configurable delays)

---

## 📸 Screenshot Assets Needed

### Hero Section
- [ ] **Homepage hero** - All Dreams view with sample data
- [ ] **Dream detail** - Consolidated view of "Dreamcatcher Launch Strategy"
- [ ] **Timeline view** - Showing conversation evolution
- [ ] **Fragments view** - Grid layout of conversation pieces

### Feature Highlights
- [ ] **Search & Filter** - Dynamic filtering in action
- [ ] **Brand Grouping** - Dreams organized by brand (BC Innovations, BC Studio, etc.)
- [ ] **Todo Management** - Todo list with deadlines and progress
- [ ] **Multi-view Modes** - Consolidated, Timeline, Fragments side by side

### UI Details
- [ ] **Dark theme** - Beautiful dark UI showcase
- [ ] **Tag system** - Tags and filtering
- [ ] **Status badges** - Different statuses (In Progress, Completed, etc.)
- [ ] **Fragment cards** - Individual conversation fragments

### Mobile Responsive
- [ ] **Mobile view** - All Dreams grid on phone
- [ ] **Mobile dream detail** - Readable conversation view
- [ ] **Mobile navigation** - Sidebar/hamburger menu

### Authentication (When Supabase Configured)
- [ ] **Sign in screen** - Beautiful auth UI
- [ ] **Sign up form** - New user registration
- [ ] **User menu** - Profile dropdown

---

## 🎬 Silent Demo Videos Needed

### 1. Quick Tour (30-60 seconds)
**Script**:
1. Load homepage - All Dreams view
2. Hover over dream cards (show tooltips)
3. Click into "Dreamcatcher Launch Strategy"
4. Switch between view modes (Consolidated → Timeline → Fragments)
5. Open todos panel
6. Return to All Dreams

**Purpose**: Quick product overview for landing page

---

### 2. Creating a Dream (45 seconds)
**Script**:
1. Click "New Dream" button
2. Fill in form (title, description, brand, tags)
3. Save dream
4. See it appear in list
5. Click into it
6. Add first fragment
7. See fragment in timeline

**Purpose**: Demonstrate core workflow

---

### 3. Search & Filter (30 seconds)
**Script**:
1. Show All Dreams view with multiple dreams
2. Type in search box (real-time filtering)
3. Select brand filter (show BC Innovations only)
4. Select status filter (In Progress)
5. Click tag filter
6. Clear filters

**Purpose**: Show powerful organization features

---

### 4. Todo Management (45 seconds)
**Script**:
1. Open a dream with todos
2. Click todos tab
3. Show existing todos with deadlines
4. Add new todo with category and deadline
5. Check off a completed todo
6. Show progress bar update
7. Show overdue alert

**Purpose**: Highlight project management features

---

### 5. Multi-View Comparison (30 seconds)
**Script**:
1. Open dream detail
2. Show Consolidated view (all fragments merged)
3. Switch to Timeline view (chronological)
4. Switch to Fragments view (grid)
5. Show Summary view
6. Highlight value of different perspectives

**Purpose**: Show unique viewing capabilities

---

### 6. Real-time Collaboration (60 seconds) - **Requires Supabase**
**Script**:
1. Two browser windows side-by-side
2. Create dream in window 1
3. Show it appear instantly in window 2
4. Add fragment in window 2
5. Show it appear in window 1
6. Update todo in window 1
7. Show progress update in window 2

**Purpose**: Demonstrate cloud sync and real-time features

---

### 7. Full Workflow (2-3 minutes)
**Script**:
1. Start at empty state
2. Create first dream "Website Redesign"
3. Add 3 fragments from different conversations
4. Add 5 todos with deadlines
5. Mark 2 todos complete
6. Add tags
7. Change status to "In Progress"
8. Search for the dream
9. Export data
10. Show dream in different views

**Purpose**: Complete demonstration for documentation/training

---

## 📐 Asset Specifications

### Screenshots
- **Format**: PNG
- **Resolution**: 1920x1080 (desktop), 768x1024 (tablet), 375x667 (mobile)
- **Compression**: Optimized for web
- **Naming**: `{feature}-{view}-{size}.png` (e.g., `all-dreams-grid-desktop.png`)

### Videos
- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 @ 30fps
- **Duration**: 30-180 seconds
- **Size**: < 5MB (for web embedding)
- **Naming**: `{feature}-demo.mp4` (e.g., `search-filter-demo.mp4`)

---

## 🎨 Use Cases

### Website / Landing Page
- Hero screenshot (All Dreams view)
- Feature highlights (3-4 key screenshots)
- Quick tour video (embedded, autoplay, muted)

### Product Hunt Launch
- Cover image (1270x760) - All Dreams view
- Gallery images (up to 8):
  1. All Dreams grid
  2. Dream detail - Consolidated
  3. Dream detail - Timeline
  4. Todos view
  5. Search & filter
  6. Multi-brand organization
  7. Fragment detail
  8. Mobile view
- Demo video (up to 60 seconds)

### GitHub README
- Hero screenshot
- Feature showcase (multiple screenshots)
- Quick setup demo GIF

### Documentation
- Step-by-step screenshots for guides
- Feature demo videos for complex workflows

### Social Media
- Twitter/X: 1200x675 (tweet images)
- LinkedIn: 1200x627 (post images)
- Short demo clips: 15-30 seconds

---

## 🛠️ Technical Implementation

### Tool: Playwright (Already Available)
**Capabilities**:
- ✅ Navigate to any page
- ✅ Interact with elements (click, type, scroll)
- ✅ Take screenshots (full page or specific elements)
- ✅ Record video of interactions
- ✅ Simulate different devices/screen sizes
- ✅ Add delays for natural pacing

### Script Structure
```javascript
// Example: Capture All Dreams screenshot
await page.goto('http://localhost:3100');
await page.waitForSelector('.dream-card');
await page.screenshot({ 
  path: 'all-dreams-desktop.png',
  fullPage: true 
});

// Example: Record quick tour
await page.video.start({ path: 'quick-tour.mp4' });
await page.click('.dream-card:first-child');
await page.waitForTimeout(2000);
await page.click('[aria-label="Timeline view"]');
await page.waitForTimeout(2000);
await page.video.stop();
```

---

## 📋 Execution Checklist

### Phase 1: Essential Screenshots (30 min)
- [ ] All Dreams view (desktop)
- [ ] Dream detail - Consolidated (desktop)
- [ ] Dream detail - Timeline (desktop)
- [ ] Todos view (desktop)
- [ ] Mobile responsive views (3 key screens)

### Phase 2: Demo Videos (1-2 hours)
- [ ] Quick tour (30-60 sec)
- [ ] Creating a dream (45 sec)
- [ ] Search & filter (30 sec)
- [ ] Todo management (45 sec)

### Phase 3: Marketing Assets (1 hour)
- [ ] Product Hunt cover image (1270x760)
- [ ] Product Hunt gallery (8 images)
- [ ] Social media images (various sizes)
- [ ] GitHub README hero

### Phase 4: Documentation Assets (1 hour)
- [ ] Setup guide screenshots
- [ ] Feature guide screenshots
- [ ] Troubleshooting screenshots

---

## 🎯 Priority Order

### **High Priority** (Launch Critical)
1. All Dreams view screenshot (hero image)
2. Dream detail screenshot
3. Quick tour video (30-60 sec)
4. Product Hunt gallery images

### **Medium Priority** (Launch Day)
5. Search & filter demo
6. Todo management demo
7. Mobile screenshots
8. Social media images

### **Low Priority** (Post-Launch)
9. Full workflow video (2-3 min)
10. Real-time collaboration demo (requires Supabase)
11. Documentation screenshots
12. Animated GIFs for specific features

---

## 💡 Creative Ideas

### Animated GIFs
- **Real-time search** - Typing and seeing results filter
- **Todo completion** - Checking off task and seeing progress bar
- **View mode switching** - Cycling through Consolidated → Timeline → Fragments
- **Tag filtering** - Clicking tags and seeing dreams filter

### Before/After Comparisons
- **Without Dreamcatcher**: Scattered chat windows, lost ideas
- **With Dreamcatcher**: Organized dreams, searchable, tracked

### Feature Callouts
- Screenshot with annotations pointing to key features
- Numbered steps overlaid on screenshots
- Highlight boxes around important UI elements

---

## 📊 Success Metrics

### Quality Checklist
- [ ] Screenshots are high resolution and crisp
- [ ] Videos are smooth (30fps) and properly paced
- [ ] UI looks professional (no console errors visible)
- [ ] Data looks realistic (not Lorem Ipsum)
- [ ] Branding is consistent
- [ ] File sizes are optimized for web

### Coverage Checklist
- [ ] All major features represented
- [ ] Multiple use cases shown
- [ ] Desktop and mobile covered
- [ ] Both light and dark themes (if applicable)

---

## 🚀 When to Create

**Best Time**: 
- After v2.3.0 is stable (NOW - hotfix complete ✅)
- Before Product Hunt launch
- When sample data is polished
- When UI is final

**Estimated Time**:
- Screenshots: 30-60 minutes
- Demo videos: 2-3 hours
- Editing/optimization: 1-2 hours
- **Total**: ~4-6 hours for complete asset package

---

## 📁 Asset Storage

**Location**: `docs/marketing/assets/`

**Structure**:
```
docs/marketing/assets/
├── screenshots/
│   ├── desktop/
│   │   ├── all-dreams-view.png
│   │   ├── dream-detail-consolidated.png
│   │   └── ...
│   ├── mobile/
│   │   └── ...
│   └── social/
│       ├── twitter-1200x675.png
│       └── product-hunt-cover.png
├── videos/
│   ├── quick-tour.mp4
│   ├── creating-dream-demo.mp4
│   └── ...
├── gifs/
│   ├── real-time-search.gif
│   └── ...
└── README.md (this file with asset inventory)
```

---

## ✅ Ready to Execute

**Status**: ✅ Capability confirmed  
**Tools**: ✅ Playwright available  
**App**: ✅ Working and tested  
**Data**: ✅ Sample data loaded  
**Timing**: 🟡 Ready when needed (add to launch checklist)

---

**Next Step**: Add to sprint/launch checklist when ready to create assets.

**Command to run**: Create a script in `scripts/capture-marketing-assets.js` that automates the entire process.

---

*Created: 2025-10-12*  
*Status: Planning - Ready to Execute*  
*Estimated Time: 4-6 hours for complete package*

