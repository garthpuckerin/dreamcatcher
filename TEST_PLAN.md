# Dreamcatcher Test Plan

## Overview
This document outlines the testing strategy for Dreamcatcher to ensure code quality and functionality before commits.

---

## Test Categories

### 1. Build Verification Tests (Pre-Commit Required)

#### 1.1 Dependency Installation
```bash
cd C:\MPGWorldwide\dreamcatcher
npm install
```
**Expected**: All dependencies install without errors

#### 1.2 Build Compilation
```bash
npm run build
```
**Expected**: 
- ✅ Build completes without errors
- ✅ dist/ folder created with compiled assets
- ✅ No TypeScript/ESLint errors

#### 1.3 Development Server Startup
```bash
npm run dev
```
**Expected**:
- ✅ Server starts on http://localhost:3100
- ✅ No console errors
- ✅ App loads in browser

---

### 2. Runtime Tests (Pre-Commit Required)

#### 2.1 Application Load
**Test**: Navigate to http://localhost:3100
**Expected**:
- ✅ Page loads without errors
- ✅ No JavaScript console errors
- ✅ UI renders correctly

#### 2.2 Authentication (Supabase Mode)
**Prerequisites**: Supabase configured with .env.local

**Test 2.2.1: Sign Up**
- Navigate to app
- Click "Sign up"
- Enter email and password
- Submit form

**Expected**:
- ✅ No errors in console
- ✅ Success message displays
- ✅ User receives confirmation email (if enabled)

**Test 2.2.2: Sign In**
- Enter credentials
- Click "Sign In"

**Expected**:
- ✅ User is authenticated
- ✅ Redirected to main app
- ✅ User email displays in header

**Test 2.2.3: Sign Out**
- Click user menu
- Click "Sign Out"

**Expected**:
- ✅ User is signed out
- ✅ Redirected to auth screen
- ✅ No errors

#### 2.3 LocalStorage Mode (Fallback)
**Test**: Run app without Supabase configuration

**Expected**:
- ✅ App loads directly to main interface
- ✅ Sample data displays
- ✅ No authentication required
- ✅ Data persists in localStorage

---

### 3. Functional Tests

#### 3.1 Dream Management

**Test 3.1.1: Create Dream**
- Click "New Dream"
- Fill in title, description, brand, status, tags
- Save

**Expected**:
- ✅ Dream created successfully
- ✅ Appears in dreams list
- ✅ Data persists after refresh

**Test 3.1.2: Edit Dream**
- Select a dream
- Click edit icon
- Modify fields
- Save

**Expected**:
- ✅ Changes saved
- ✅ Updated timestamp changes
- ✅ Changes visible immediately

**Test 3.1.3: Delete Dream**
- Select a dream
- Click delete
- Confirm deletion

**Expected**:
- ✅ Dream removed from list
- ✅ All associated fragments deleted
- ✅ No errors

#### 3.2 Fragment Management

**Test 3.2.1: Add Fragment**
- Select a dream
- Click "Add Fragment"
- Enter content
- Save

**Expected**:
- ✅ Fragment created
- ✅ Appears in fragments list
- ✅ Associated with correct dream

**Test 3.2.2: Edit Fragment**
- Select fragment
- Edit content
- Save

**Expected**:
- ✅ Changes saved
- ✅ Visible in all views

**Test 3.2.3: Delete Fragment**
- Select fragment
- Delete

**Expected**:
- ✅ Fragment removed
- ✅ Dream still exists
- ✅ Fragment count updates

#### 3.3 Todo Management

**Test 3.3.1: Create Todo**
- Select a dream
- Add todo with title, category, deadline
- Save

**Expected**:
- ✅ Todo appears in todos list
- ✅ Deadline displays correctly
- ✅ Category icon shows

**Test 3.3.2: Complete Todo**
- Click checkbox on todo

**Expected**:
- ✅ Todo marked complete
- ✅ Completed timestamp set
- ✅ Progress bar updates

**Test 3.3.3: Delete Todo**
- Delete a todo

**Expected**:
- ✅ Todo removed
- ✅ Progress updates

#### 3.4 Search & Filter

**Test 3.4.1: Search**
- Enter search query

**Expected**:
- ✅ Results filter in real-time
- ✅ Matches title and content
- ✅ No lag

**Test 3.4.2: Status Filter**
- Select status filter

**Expected**:
- ✅ Only matching dreams show
- ✅ Count updates

**Test 3.4.3: Brand Filter**
- Select brand filter

**Expected**:
- ✅ Dreams filtered by brand
- ✅ UI updates correctly

#### 3.5 View Modes

**Test 3.5.1: All Dreams View**
- Click "All Dreams"

**Expected**:
- ✅ Grid of dream cards displays
- ✅ Search/filter works
- ✅ Sorting works

**Test 3.5.2: Dream Detail Views**
- Open a dream
- Switch between Consolidated/Timeline/Fragments views

**Expected**:
- ✅ All views render correctly
- ✅ Data displays properly
- ✅ Navigation works

---

### 4. Integration Tests (Supabase Mode)

#### 4.1 Real-time Sync
**Prerequisites**: Two browser windows signed in as same user

**Test**:
1. Create dream in window 1
2. Observe window 2

**Expected**:
- ✅ Dream appears in window 2 automatically
- ✅ No page refresh needed
- ✅ Data is identical

#### 4.2 Data Persistence
**Test**:
1. Create data while signed in
2. Sign out
3. Sign in again

**Expected**:
- ✅ All data still present
- ✅ Correct order maintained
- ✅ No data loss

#### 4.3 Multi-user Isolation
**Prerequisites**: Two different user accounts

**Test**:
1. Create dreams as User A
2. Sign in as User B

**Expected**:
- ✅ User B sees ONLY their own data
- ✅ No cross-contamination
- ✅ Row-level security working

---

### 5. Data Migration Tests

#### 5.1 LocalStorage to Supabase
**Test**:
1. Use app in localStorage mode
2. Create test data
3. Set up Supabase
4. Run migration utility

**Expected**:
- ✅ All dreams migrated
- ✅ All fragments migrated
- ✅ All todos migrated
- ✅ Relationships preserved
- ✅ No data loss

---

### 6. Browser Compatibility Tests

**Test on**:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Safari (latest)

**Expected**: All core functionality works

---

### 7. Performance Tests

#### 7.1 Large Dataset
**Test**: Create 50+ dreams with multiple fragments

**Expected**:
- ✅ UI remains responsive
- ✅ Search is fast (<1s)
- ✅ No lag when scrolling

#### 7.2 Memory Leaks
**Test**: Use app for extended session (30+ minutes)

**Expected**:
- ✅ No memory growth
- ✅ No slowdown
- ✅ No crashes

---

## Test Execution Checklist

### Pre-Commit Testing (Required)
- [ ] Dependencies install successfully (`npm install`)
- [ ] Build completes without errors (`npm run build`)
- [ ] Dev server starts (`npm run dev`)
- [ ] App loads in browser without errors
- [ ] No console errors on page load
- [ ] Basic CRUD operations work
- [ ] Data persists after refresh

### Pre-Push Testing (Required)
- [ ] All pre-commit tests pass
- [ ] Authentication flow works (if Supabase configured)
- [ ] LocalStorage fallback works (without Supabase)
- [ ] Search and filter function
- [ ] All view modes work
- [ ] No linter errors

### Pre-Release Testing (Required)
- [ ] All functional tests pass
- [ ] Integration tests pass (Supabase mode)
- [ ] Data migration tested
- [ ] Browser compatibility verified
- [ ] Performance acceptable
- [ ] Documentation up to date

---

## Test Automation (Future)

### Unit Tests (Planned)
- Component rendering tests
- Hook logic tests
- Utility function tests

### Integration Tests (Planned)
- API interaction tests
- Real-time subscription tests
- Authentication flow tests

### E2E Tests (Planned)
- Full user workflow tests
- Cross-browser automation
- Visual regression tests

---

## Failure Protocol

### If Tests Fail
1. **Do NOT commit**
2. Fix the issue
3. Re-run tests
4. Only commit when all tests pass

### If Broken Code Was Committed
1. Create hotfix branch immediately
2. Fix the issue
3. Test thoroughly
4. Commit with `fix:` prefix
5. Push hotfix
6. Merge to affected branches

---

## Test Environment Setup

### LocalStorage Mode (Quick Test)
```bash
cd C:\MPGWorldwide\dreamcatcher
npm install
npm run dev
# Navigate to http://localhost:3100
```

### Supabase Mode (Full Test)
```bash
# 1. Create Supabase project
# 2. Run migrations from supabase/migrations/
# 3. Create .env.local:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 4. Install and run
npm install
npm run dev
```

---

## Test Data

### Sample Dreams for Testing
See `docs/marketing/REAL_DREAMS_DEMO.json` for authentic test data

### Test User Accounts
- Create test accounts in Supabase
- Use `test+1@example.com`, `test+2@example.com` for multi-user tests

---

## Reporting Issues

When tests fail, document:
1. Test name that failed
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors
5. Browser/environment details

---

**Last Updated**: 2025-10-12  
**Version**: 2.3.0  
**Status**: Active

