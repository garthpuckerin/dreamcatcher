# AI Features Test Plan - Dreamcatcher v2.4.0

## Test Environment Setup

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] OpenAI API key obtained
- [ ] `.env.local` file created with `VITE_OPENAI_API_KEY`
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)

### Test Data Requirements
- [ ] Sample dreams with fragments
- [ ] Test documents (TXT, MD, DOCX)
- [ ] Various search queries
- [ ] Edge case content (empty, very long, special characters)

---

## Phase 1: Build Verification Tests

### 1.1 Dependency Installation
```bash
npm install
```
**Expected**: No errors, all packages installed including:
- `openai@^4.20.1`
- `mammoth@^1.6.0`
- `pdf-parse@^1.1.1`

**Status**: ☐ Pass ☐ Fail

### 1.2 Build Test
```bash
npm run build
```
**Expected**: Clean build with no errors, `dist/` folder created

**Status**: ☐ Pass ☐ Fail

### 1.3 Development Server
```bash
npm run dev
```
**Expected**: Server starts on http://localhost:5173, no console errors

**Status**: ☐ Pass ☐ Fail

---

## Phase 2: AI Service Layer Tests

### 2.1 AI Configuration Test

**Test**: Check AI availability without API key
1. Ensure `VITE_OPENAI_API_KEY` is NOT set
2. Start dev server
3. Check browser console

**Expected**: 
- Warning message: "⚠️ AI features disabled - set VITE_OPENAI_API_KEY"
- `isAIAvailable()` returns `false`
- No errors thrown

**Status**: ☐ Pass ☐ Fail

---

### 2.2 AI Configuration Test (With Key)

**Test**: Check AI availability with API key
1. Set valid `VITE_OPENAI_API_KEY` in `.env.local`
2. Restart dev server
3. Check browser console

**Expected**:
- Log message: "🤖 AI features enabled"
- `isAIAvailable()` returns `true`
- OpenAI client initialized

**Status**: ☐ Pass ☐ Fail

---

### 2.3 Dream Summarization Test

**Test Data**:
```javascript
const testDream = {
  id: 1,
  title: "E-commerce Platform",
  description: "Building a modern e-commerce platform",
  fragments: [
    {
      id: 1,
      title: "Initial Planning",
      content: "We need to build a full-stack e-commerce platform with React frontend, Node.js backend, and PostgreSQL database. Key features include product catalog, shopping cart, checkout, and payment integration with Stripe."
    }
  ]
};
```

**Test Steps**:
1. Call `generateDreamSummary(testDream)`
2. Wait for response
3. Verify output

**Expected**:
- Returns string (2-3 sentences)
- Content summarizes the project
- Mentions key technologies or features
- Completes within 5-10 seconds

**Actual Output**:
```
[Record actual summary here]
```

**Status**: ☐ Pass ☐ Fail

---

### 2.4 Tag Suggestions Test

**Test Steps**:
1. Call `suggestTags(testDream)`
2. Wait for response
3. Verify output

**Expected**:
- Returns array of 5-8 strings
- Tags are lowercase
- Tags are relevant (e.g., "react", "ecommerce", "nodejs", "postgresql")
- No duplicates

**Actual Output**:
```
[Record actual tags here]
```

**Status**: ☐ Pass ☐ Fail

---

### 2.5 Fragment Highlights Test

**Test Data**:
```javascript
const testFragment = {
  id: 1,
  title: "Database Schema Discussion",
  content: "Let's design the database schema. We'll need tables for users, products, orders, and order_items. The users table should have authentication fields. Products need pricing, inventory, and images. Orders need to track status (pending, processing, shipped, delivered). We should use UUIDs for all primary keys for scalability."
};
```

**Test Steps**:
1. Call `extractFragmentHighlights(testFragment)`
2. Wait for response
3. Verify output

**Expected**:
- Returns array of 3-5 strings
- Highlights key decisions or points
- Each highlight is concise (1-2 sentences)

**Actual Output**:
```
[Record actual highlights here]
```

**Status**: ☐ Pass ☐ Fail

---

### 2.6 Project Name Detection Test

**Test Data**:
```javascript
const content = "I'm working on building a project called TaskMaster for productivity. We're also considering creating ShopEasy as a side project.";
```

**Test Steps**:
1. Call `detectProjectNames(content)`
2. Wait for response
3. Verify output

**Expected**:
- Returns array: `["TaskMaster", "ShopEasy"]`
- Capitalizes project names correctly
- No false positives

**Actual Output**:
```
[Record actual project names here]
```

**Status**: ☐ Pass ☐ Fail

---

### 2.7 Document Parsing Test

**Test Data**: Create `test-document.txt`
```
Project: TaskMaster MVP

TODO:
- Set up database schema by October 15
- Implement user authentication by October 20
- Design dashboard UI by October 18
- Write API documentation
- Deploy to staging environment

The project aims to create a task management system with AI features.
Key requirements include real-time collaboration and mobile apps.
```

**Test Steps**:
1. Read file content
2. Call `parseDocument(fileContent, "test-document.txt")`
3. Wait for response
4. Verify output

**Expected**:
- Returns object with:
  - `todos`: Array of 5 todo objects
  - Each todo has: `title`, `category`, `deadline` (where applicable)
  - `summary`: Brief document summary
  - `keyPoints`: Array of key points
- Deadlines parsed correctly (ISO format)
- Categories assigned (e.g., "coding", "admin", "design")

**Actual Output**:
```
[Record actual parsed data here]
```

**Status**: ☐ Pass ☐ Fail

---

### 2.8 Semantic Search Test

**Test Data**: Array of 3 dreams with different content

**Test Queries**:
1. "projects using React"
2. "e-commerce or shopping apps"
3. "tasks related to database design"

**Test Steps**: For each query:
1. Call `semanticSearch(query, testDreams)`
2. Wait for response
3. Verify results

**Expected**:
- Returns ranked array of results
- Each result has: `dream`, `score` (0-1), `reason`
- Results sorted by score (highest first)
- Only relevant results included (score > 0.3)
- Reason explains the match

**Actual Output**:
```
[Record actual search results here]
```

**Status**: ☐ Pass ☐ Fail

---

## Phase 3: Document Parser Tests

### 3.1 Text File Parsing

**Test File**: Create `test.txt` with 500 words of content

**Test Steps**:
1. Call `parseDocumentFile(file)`
2. Verify output

**Expected**:
- Returns full text content
- Preserves line breaks and formatting
- Completes instantly

**Status**: ☐ Pass ☐ Fail

---

### 3.2 Markdown File Parsing

**Test File**: Create `test.md` with markdown content

**Test Steps**:
1. Call `parseDocumentFile(file)`
2. Verify output

**Expected**:
- Returns text content
- Markdown syntax preserved
- Completes instantly

**Status**: ☐ Pass ☐ Fail

---

### 3.3 DOCX File Parsing

**Test File**: Create `test.docx` in Microsoft Word

**Test Steps**:
1. Call `parseDocumentFile(file)`
2. Verify output

**Expected**:
- Returns text content (no formatting)
- Paragraphs separated by line breaks
- Completes within 1-2 seconds

**Status**: ☐ Pass ☐ Fail

---

### 3.4 PDF File Parsing (Expected Failure)

**Test File**: `test.pdf`

**Test Steps**:
1. Call `parseDocumentFile(file)`
2. Verify error handling

**Expected**:
- Throws error with message about backend requirement
- No crash
- User-friendly error message

**Status**: ☐ Pass ☐ Fail

---

### 3.5 File Validation Tests

**Test Cases**:

| File Type | Size | Expected Result |
|-----------|------|-----------------|
| test.txt | 5MB | Pass |
| test.txt | 15MB | Fail ("too large") |
| test.exe | 1MB | Fail ("unsupported type") |
| test.jpg | 500KB | Fail ("unsupported type") |

**Status**: ☐ Pass ☐ Fail

---

## Phase 4: UI Component Tests

### 4.1 DocumentUpload Component

**Test Steps**:
1. Navigate to a dream detail view
2. Render `<DocumentUpload dreamId={1} />`
3. Test drag-and-drop
4. Test file browser
5. Upload valid document
6. Verify parsing results

**Expected**:
- Drag-and-drop works
- File browser opens
- Upload progress shown
- Parsing status shown
- Results passed to parent component
- Success message displayed

**Visual Verification**:
- [ ] Component renders correctly
- [ ] Drag hover state works
- [ ] Loading animations smooth
- [ ] Success/error states clear
- [ ] Mobile responsive

**Status**: ☐ Pass ☐ Fail

---

### 4.2 AIAssistant Component (Tags)

**Test Steps**:
1. Open dream create/edit form
2. Add some content to dream
3. Render `<AIAssistant dream={dream} type="tags" />`
4. Click "Suggest Tags"
5. Wait for suggestions
6. Click individual tag to add
7. Click "Add All Tags"

**Expected**:
- Button shows loading state
- Suggestions appear after ~3-5 seconds
- Individual tags clickable
- "Add All" applies all tags
- Parent component receives tags
- Cancel button works

**Visual Verification**:
- [ ] Button styling correct
- [ ] Loading spinner shows
- [ ] Tag pills styled well
- [ ] Hover states work
- [ ] Mobile responsive

**Status**: ☐ Pass ☐ Fail

---

### 4.3 AIAssistant Component (Summary)

**Test Steps**:
1. Navigate to dream with fragments
2. Render `<AIAssistant dream={dream} type="summary" />`
3. Click "Generate Summary"
4. Wait for generation
5. Review summary
6. Click "Use This Summary"

**Expected**:
- Button shows loading state
- Summary appears after ~5-10 seconds
- Summary is relevant and concise
- "Use" button applies summary
- Cancel works

**Status**: ☐ Pass ☐ Fail

---

## Phase 5: Hook Tests

### 5.1 useAI Hook

**Test Steps**:
```javascript
const {
  aiAvailable,
  loading,
  error,
  generateSummary,
  getTagSuggestions
} = useAI();
```

**Test Cases**:
1. `aiAvailable` reflects configuration correctly
2. `loading` updates during API calls
3. `error` captures and displays errors
4. All functions return expected data types
5. Multiple simultaneous calls handled correctly

**Status**: ☐ Pass ☐ Fail

---

### 5.2 useDocuments Hook

**Test Steps**:
```javascript
const {
  uploading,
  parsing,
  error,
  uploadAndParseDocument
} = useDocuments();
```

**Test Cases**:
1. `uploading` flag updates correctly
2. `parsing` flag updates correctly
3. `error` captures validation and parsing errors
4. Returns complete document object
5. Supabase integration works (if configured)
6. LocalStorage fallback works

**Status**: ☐ Pass ☐ Fail

---

## Phase 6: Integration Tests

### 6.1 End-to-End Document Upload Flow

**Scenario**: User uploads document and creates todos

**Steps**:
1. Create new dream
2. Navigate to dream detail
3. Upload document with todos
4. Verify todos extracted
5. Check todos appear in UI
6. Verify todo categories assigned
7. Verify deadlines parsed

**Expected**: Complete workflow with no errors

**Status**: ☐ Pass ☐ Fail

---

### 6.2 End-to-End Dream Creation with AI

**Scenario**: User creates dream with AI assistance

**Steps**:
1. Click "New Dream"
2. Enter title and description
3. Click "Suggest Tags"
4. Add suggested tags
5. Save dream
6. Generate summary
7. Verify summary saved

**Expected**: Complete workflow with AI enhancements

**Status**: ☐ Pass ☐ Fail

---

### 6.3 Semantic Search Integration

**Scenario**: User searches with natural language

**Steps**:
1. Create 5 diverse dreams
2. Enter semantic search query (e.g., "web apps with databases")
3. Enable AI search
4. View results
5. Verify ranking and relevance
6. Test fallback (disable AI)

**Expected**: 
- AI search returns relevant results
- Fallback works when AI disabled
- Results ranked by relevance

**Status**: ☐ Pass ☐ Fail

---

## Phase 7: Performance Tests

### 7.1 AI Response Time

**Metrics to Track**:
| Operation | Expected Time | Actual Time |
|-----------|---------------|-------------|
| Tag Suggestions | < 5 seconds | |
| Dream Summary | < 10 seconds | |
| Fragment Highlights | < 5 seconds | |
| Document Parsing | < 15 seconds | |
| Semantic Search | < 8 seconds | |

**Status**: ☐ Pass ☐ Fail

---

### 7.2 Large Document Test

**Test**: Upload 5MB document

**Expected**:
- Parses without crashing
- Completes within 30 seconds
- Memory usage reasonable
- UI remains responsive

**Status**: ☐ Pass ☐ Fail

---

### 7.3 Concurrent Operations

**Test**: Trigger multiple AI operations simultaneously
1. Generate summary
2. Suggest tags
3. Parse document

**Expected**:
- All operations complete successfully
- No race conditions
- UI remains responsive
- Results accurate

**Status**: ☐ Pass ☐ Fail

---

## Phase 8: Error Handling Tests

### 8.1 API Key Invalid

**Test**: Set invalid API key

**Expected**:
- Clear error message
- No crash
- Fallback functionality works
- User informed to check API key

**Status**: ☐ Pass ☐ Fail

---

### 8.2 Network Error

**Test**: Disconnect network during AI operation

**Expected**:
- Error caught and displayed
- User-friendly error message
- Retry option available
- No data loss

**Status**: ☐ Pass ☐ Fail

---

### 8.3 API Rate Limit

**Test**: Trigger rate limit (make 50+ rapid requests)

**Expected**:
- Rate limit error caught
- User informed to wait
- Queue or retry mechanism
- No crash

**Status**: ☐ Pass ☐ Fail

---

### 8.4 Malformed Content

**Test Cases**:
- Empty dream (no content)
- Very long content (>50,000 characters)
- Special characters and unicode
- Binary/corrupted file

**Expected**: Graceful error handling for all cases

**Status**: ☐ Pass ☐ Fail

---

## Phase 9: Browser Compatibility

**Test in Each Browser**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

**Test Cases**:
1. AI features initialize correctly
2. Document upload works
3. File drag-and-drop works
4. UI components render correctly
5. No console errors

**Status**: ☐ Pass ☐ Fail

---

## Phase 10: Accessibility Tests

### 10.1 Keyboard Navigation

**Test**: Navigate AI features using only keyboard

**Expected**:
- All buttons focusable
- Tab order logical
- Enter/Space activates buttons
- Escape closes modals
- Focus indicators visible

**Status**: ☐ Pass ☐ Fail

---

### 10.2 Screen Reader Compatibility

**Test**: Use screen reader (NVDA/JAWS/VoiceOver)

**Expected**:
- All content readable
- Button purposes announced
- Loading states announced
- Error messages announced
- Success feedback provided

**Status**: ☐ Pass ☐ Fail

---

## Phase 11: Security Tests

### 11.1 API Key Exposure

**Test**: Check browser dev tools and network tab

**Expected**:
- API key not visible in DOM
- API key not logged to console (unless debug mode)
- Warning about production security shown

**Status**: ☐ Pass ☐ Fail

---

### 11.2 File Upload Security

**Test**: Attempt to upload malicious files

**Expected**:
- File type validation works
- Size limits enforced
- No code execution from uploads
- Sanitization applied

**Status**: ☐ Pass ☐ Fail

---

## Pre-Commit Checklist

Before committing v2.4.0:

- [ ] All Phase 1 (Build) tests pass
- [ ] All Phase 2 (AI Service) tests pass
- [ ] All Phase 3 (Document Parser) tests pass
- [ ] All Phase 4 (UI Components) tests pass
- [ ] All Phase 5 (Hooks) tests pass
- [ ] At least 2 Phase 6 (Integration) tests pass
- [ ] Performance tests show acceptable times
- [ ] Error handling tests pass
- [ ] Chrome and Firefox tests pass
- [ ] No console errors in production build
- [ ] Documentation updated
- [ ] CHANGELOG.md updated

---

## Test Summary Report Template

```markdown
# Test Execution Report - v2.4.0
**Date**: [YYYY-MM-DD]
**Tester**: [Name]
**Environment**: [OS, Browser, Node version]

## Results Summary
- **Total Tests**: XX
- **Passed**: XX
- **Failed**: XX
- **Skipped**: XX
- **Pass Rate**: XX%

## Critical Issues Found
1. [Issue description]
2. [Issue description]

## Recommendations
- [Action item]
- [Action item]

## Sign-off
- [ ] All critical issues resolved or documented
- [ ] Ready for production deployment
```

---

## Continuous Testing

### Daily Smoke Tests
- [ ] Dev server starts
- [ ] AI features available (with key)
- [ ] Tag suggestions work
- [ ] Summary generation works
- [ ] No console errors

### Weekly Regression Tests
- [ ] Run full test suite
- [ ] Check API costs
- [ ] Review error logs
- [ ] Update test data

### Pre-Release Tests
- [ ] Complete test plan
- [ ] Performance benchmarks
- [ ] Security audit
- [ ] Documentation review

