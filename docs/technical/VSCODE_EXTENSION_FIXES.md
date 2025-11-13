# VS Code Extension TypeScript Fixes

**Status:** Needs fixing in Phase 2
**Priority:** HIGH
**Branch:** feat/add-development-tooling

---

## Current Issues

The VS Code extension has 24 TypeScript compilation errors that need to be fixed:

### 1. Missing Type Imports

**Files:** Multiple
**Issue:** `Cannot find name 'Dream'`, `Cannot find name 'WebSocket'`, `Cannot find name 'fetch'`

**Solution:** Add proper type imports and lib configuration

### 2. Undefined Variables

**Files:**
- `src/conversation-capture.ts:75` - Cannot find name 'dream'
- `src/pipelineos-integration.ts:69` - Cannot find name 'syncedCount'

**Solution:** Fix variable scoping and initialization

### 3. Type Mismatches

**Files:**
- `src/dreamcatcher-provider.ts:30` - Dream | undefined not assignable
- `src/dreamcatcher-provider.ts:33` - Fragment | undefined not assignable
- `src/extension.ts:166` - Uri passed instead of ExtensionContext

**Solution:** Add proper null checks and type guards

### 4. Implicit Any Types

**Files:**
- `src/pipelineos-integration.ts:191` - Parameter 'event' has any type
- `src/pipelineos-integration.ts:206` - Parameter 'error' has any type

**Solution:** Add explicit type annotations

### 5. Missing DOM/Node Types

**Files:** `packages/shared/src/api.ts`
**Issue:** fetch and WebSocket not found

**Solution:** Update tsconfig.json to include proper lib types

---

## Detailed Error List

```
src/conversation-capture.ts(75,62): error TS2304: Cannot find name 'dream'.
src/dreamcatcher-provider.ts(30,38): error TS2345: Argument of type 'Dream | undefined' is not assignable to parameter of type 'Dream'.
src/dreamcatcher-provider.ts(33,44): error TS2345: Argument of type 'Fragment | undefined' is not assignable to parameter of type 'Fragment'.
src/extension.ts(166,47): error TS2345: Argument of type 'Uri' is not assignable to parameter of type 'ExtensionContext'.
src/pipelineos-integration.ts(69,62): error TS2304: Cannot find name 'syncedCount'.
src/pipelineos-integration.ts(77,40): error TS2304: Cannot find name 'Dream'.
src/pipelineos-integration.ts(158,45): error TS2304: Cannot find name 'Dream'.
src/pipelineos-integration.ts(171,33): error TS2304: Cannot find name 'WebSocket'.
src/pipelineos-integration.ts(185,28): error TS2304: Cannot find name 'WebSocket'.
src/pipelineos-integration.ts(191,29): error TS7006: Parameter 'event' implicitly has an 'any' type.
src/pipelineos-integration.ts(206,27): error TS7006: Parameter 'error' implicitly has an 'any' type.
src/pipelineos-integration.ts(236,38): error TS2304: Cannot find name 'Dream'.
../../packages/shared/src/api.ts(8,28): error TS2304: Cannot find name 'fetch'.
../../packages/shared/src/api.ts(25,28): error TS2304: Cannot find name 'fetch'.
../../packages/shared/src/api.ts(42,28): error TS2304: Cannot find name 'fetch'.
../../packages/shared/src/api.ts(56,28): error TS2304: Cannot find name 'fetch'.
../../packages/shared/src/api.ts(70,28): error TS2304: Cannot find name 'fetch'.
../../packages/shared/src/api.ts(87,28): error TS2304: Cannot find name 'fetch'.
../../packages/shared/src/api.ts(100,28): error TS2304: Cannot find name 'fetch'.
../../packages/shared/src/api.ts(115,38): error TS2304: Cannot find name 'WebSocket'.
../../packages/shared/src/api.ts(117,16): error TS2304: Cannot find name 'WebSocket'.
../../packages/shared/src/api.ts(123,30): error TS2304: Cannot find name 'fetch'.
```

---

## Quick Fixes

### Fix 1: Update packages/shared/tsconfig.json

Add DOM lib for fetch and WebSocket:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],  // Add DOM
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  }
}
```

### Fix 2: Add missing imports to extension files

In each file with type errors, add:

```typescript
import { Dream, Fragment, PipelineOSConfig } from '@dreamcatcher/types'
```

### Fix 3: Fix variable scoping in conversation-capture.ts

Find line 75 and fix undefined 'dream' variable

### Fix 4: Add null checks in dreamcatcher-provider.ts

```typescript
// Before
const dream = dreams.find(d => d.id === dreamId)
return new DreamTreeItem(dream)  // Error: dream might be undefined

// After
const dream = dreams.find(d => d.id === dreamId)
if (!dream) return null
return new DreamTreeItem(dream)  // OK
```

### Fix 5: Fix ExtensionContext in extension.ts line 166

```typescript
// Before
const storageManager = new StorageManager(vscode.workspace.workspaceFolders?.[0]?.uri || vscode.Uri.file(''))

// After
const storageManager = new StorageManager(context)  // Use context parameter
```

---

## Implementation Plan

### Step 1: Fix tsconfig.json files (5 min)
- Update packages/shared/tsconfig.json to include DOM lib
- Update extensions/vscode/tsconfig.json if needed

### Step 2: Add missing imports (10 min)
- Add Dream, Fragment imports to all extension files
- Verify types resolve correctly

### Step 3: Fix variable scoping (15 min)
- Fix 'dream' undefined in conversation-capture.ts
- Fix 'syncedCount' undefined in pipelineos-integration.ts

### Step 4: Add null checks (20 min)
- Add type guards in dreamcatcher-provider.ts
- Add null checks for optional values

### Step 5: Fix type mismatches (10 min)
- Fix Uri vs ExtensionContext in extension.ts
- Add explicit types to event handlers

### Step 6: Test compilation (5 min)
```bash
cd extensions/vscode
npm run compile
# Should succeed without errors
```

---

## Priority

**HIGH** - Should be fixed in Phase 2

While the extension TypeScript errors don't block the main app, they prevent the VS Code extension from being used, which is a key feature of the dual-track strategy.

---

## Estimated Effort

**1 hour** - Should be straightforward fixes

---

## Related

- See `IMPLEMENTATION_PLAN.md` Phase 2, Task 2.7
- Main issue: https://github.com/garthpuckerin/dreamcatcher/issues/2
