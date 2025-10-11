# Dreamcatcher v2.0.0 - Implementation Plan

## Version Info
- **Version:** 2.0.0
- **Date:** 2025-10-11
- **Status:** ✅ Ready for Implementation
- **Previous Version:** 1.0.0 (archived)

## Major Changes

### 1. Navigation Redesign
**OLD (v1.0.0):**
- Sidebar shows ALL dreams in expandable tree
- Click dream → shows detail in main area
- No default landing page

**NEW (v2.0.0):**
- Sidebar shows "All Dreams" link + Recent Dreams (last 10)
- Default landing: All Dreams Gallery View
- Navigation flow: Gallery → Dream Detail → Fragment Detail

### 2. New Components

#### AllDreamsView
- Grid/card layout of all dreams
- Real-time search across all fields
- Filter by status and tags (clickable chips)
- Sort options: updated, created, name, status, fragments
- Dream cards with hover effects
- Click card → navigate to dream detail

#### DreamDetailView (Refactored)
- Breadcrumb: "← All Dreams"
- Existing tabs: Consolidated, Timeline, Fragments
- Maintains all existing functionality

### 3. State Management Changes

```javascript
// REMOVED from v1.0.0:
expandedDreams: {}  // No longer needed

// ADDED in v2.0.0:
mainView: 'all-dreams'  // 'all-dreams' | 'dream-detail' | 'fragment-detail'
recentDreams: []         // Array of dream IDs (max 10)
filterTags: []          // Selected tag filters
sortBy: 'updated'       // Sort option
```

### 4. LocalStorage

```javascript
// Existing (unchanged):
'dreamcatcher-dreams' → Array of dream objects

// New:
'dreamcatcher-recent' → Array of dream IDs (last 10 accessed)
```

### 5. New Functions

```javascript
accessDream(dream)
  // Updates recent dreams list
  // Sets mainView to 'dream-detail'
  // Persists to localStorage

filteredAndSortedDreams()
  // Combines search, status, and tag filtering
  // Applies selected sort order
  // Returns filtered & sorted array

toggleTagFilter(tag)
  // Add/remove tag from filterTags
  // Updates real-time

getRecentDreamsList()
  // Maps recentDreams IDs to actual dream objects
  // Returns last 10 accessed dreams
```

## Implementation Checklist

### Pre-Implementation ✅
- [x] Backup v1.0.0 to `archive/App.v1.0.0.jsx`
- [x] Create CHANGELOG.md
- [x] Document implementation plan
- [ ] Build complete v2.0.0 in archive
- [ ] Verify v2.0.0 is complete and error-free
- [ ] Test all new features

### Implementation Steps
1. Replace `src/App.jsx` with verified v2.0.0
2. Verify HMR reload works
3. Test in browser:
   - All Dreams gallery loads
   - Search filters in real-time
   - Tag filters work
   - Sort options work
   - Navigation to dream detail works
   - Recent dreams updates
   - All existing features still work
4. Update CHANGELOG with implementation date
5. Update package.json version to 2.0.0

### Verification Criteria

✅ **Must Have:**
- [ ] No console errors
- [ ] No React errors
- [ ] All components render
- [ ] Sample data loads
- [ ] Search works
- [ ] Filters work
- [ ] Sort works
- [ ] Recent dreams tracks correctly
- [ ] All v1.0.0 features still work
- [ ] LocalStorage saves/loads correctly

## Data Migration

**Good News:** No migration needed! 
- Existing `dreamcatcher-dreams` data is 100% compatible
- New `dreamcatcher-recent` will be created on first use
- Users can upgrade seamlessly

## Rollback Plan

If v2.0.0 has issues:

```powershell
# Restore v1.0.0
Copy-Item "archive\App.v1.0.0.jsx" "src\App.jsx" -Force
```

Refresh browser - done!

## UI Comparison

### Sidebar
**v1.0.0:**
```
✨ Dreamcatcher
Search...
[Status Filter]
[New] [Import] [Export]

▼ Dreamcatcher
  • Fragment 1
  • Fragment 2
  
▼ Resume Generator
  • Fragment 1
  • Fragment 2
```

**v2.0.0:**
```
✨ Dreamcatcher (2 dreams)

[🏠 All Dreams]

[New] [Import] [Export]

⏰ Recent Dreams

• Dreamcatcher
  In Progress
  2 fragments

• Resume Generator
  Completed
  2 fragments
```

### Main Content
**v1.0.0:** Dream detail with tabs (if dream selected)

**v2.0.0:**
- **Default:** All Dreams Gallery with cards
- **On click:** Dream detail with breadcrumb

## Expected User Impact

### Positive
✅ Scales to many dreams (100+)
✅ Faster navigation with gallery view
✅ Quick access to recent dreams
✅ Better discoverability with search/filter
✅ Modern card-based UI

### Neutral
ℹ️ Different navigation flow (requires learning)
ℹ️ All Dreams button instead of automatic sidebar

### None
- All data preserved
- All features preserved
- No functionality removed

## Success Metrics

After implementation, verify:
1. ✅ App loads without errors
2. ✅ Sample data visible in gallery
3. ✅ Search filters dreams as you type
4. ✅ Can navigate to dream detail
5. ✅ Can navigate back to gallery
6. ✅ Recent dreams updates when accessing dreams
7. ✅ All CRUD operations work
8. ✅ Import/Export still works
9. ✅ LocalStorage persists correctly
10. ✅ HMR updates work

## Build Status

- **v1.0.0:** ✅ Archived
- **v2.0.0:** 🔄 Building...
- **Verification:** ⏳ Pending
- **Implementation:** ⏳ Pending

---

**Next Step:** Build complete v2.0.0 in `archive/App.v2.0.0.jsx` for verification before implementation.

