# API Documentation

## Hooks

### useAuth

Custom hook for authentication with Supabase.

```javascript
import { useAuth } from './hooks/useAuth'

const { user, session, loading, error, signIn, signOut } = useAuth()
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `user` | `Object \| null` | Current authenticated user |
| `session` | `Object \| null` | Current session |
| `loading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |
| `signUp` | `Function` | Sign up a new user |
| `signIn` | `Function` | Sign in with email/password |
| `signInWithProvider` | `Function` | Sign in with OAuth provider |
| `signOut` | `Function` | Sign out current user |
| `resetPassword` | `Function` | Send password reset email |
| `updatePassword` | `Function` | Update user password |
| `updateUser` | `Function` | Update user metadata |
| `isAuthenticated` | `Function` | Check if user is authenticated |
| `getUserEmail` | `Function` | Get user email |
| `getUserMetadata` | `Function` | Get user metadata |
| `refreshSession` | `Function` | Refresh current session |

#### Example

```javascript
const { signIn, signOut, user, isAuthenticated } = useAuth()

// Sign in
await signIn('user@example.com', 'password')

// Check authentication
if (isAuthenticated()) {
  console.log('User is logged in:', user.email)
}

// Sign out
await signOut()
```

---

### useAI

Custom hook for AI-powered features using OpenAI.

```javascript
import { useAI } from './hooks/useAI'

const { aiAvailable, generateSummary, getTagSuggestions } = useAI()
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `aiAvailable` | `boolean` | Whether AI features are available |
| `error` | `string \| null` | Error message |
| `generateSummary` | `Function` | Generate dream summary |
| `getFragmentHighlights` | `Function` | Extract fragment highlights |
| `getTagSuggestions` | `Function` | Suggest relevant tags |
| `detectProjects` | `Function` | Detect project mentions |
| `parseDocumentContent` | `Function` | Parse document with AI |
| `performSemanticSearch` | `Function` | Semantic search across content |

#### Example

```javascript
const { aiAvailable, generateSummary, getTagSuggestions } = useAI()

if (aiAvailable) {
  // Generate summary
  const summary = await generateSummary(dream)

  // Get tag suggestions
  const tags = await getTagSuggestions(dream)
}
```

---

### useDreams

Custom hook for managing dreams, fragments, and todos.

```javascript
import { useDreams } from './hooks/useDreams'

const { dreams, loading, createDream, updateDream } = useDreams()
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `dreams` | `Array` | List of all dreams |
| `loading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |
| `createDream` | `Function` | Create a new dream |
| `updateDream` | `Function` | Update existing dream |
| `deleteDream` | `Function` | Delete a dream |
| `createFragment` | `Function` | Create a fragment |
| `updateFragment` | `Function` | Update a fragment |
| `deleteFragment` | `Function` | Delete a fragment |
| `createTodo` | `Function` | Create a todo |
| `updateTodo` | `Function` | Update a todo |
| `deleteTodo` | `Function` | Delete a todo |
| `toggleTodo` | `Function` | Toggle todo completion |
| `reload` | `Function` | Reload all dreams |
| `trackDreamAccess` | `Function` | Track dream access for recents |
| `getRecentDreams` | `Function` | Get recently accessed dreams |

#### Example

```javascript
const { dreams, createDream, createFragment } = useDreams()

// Create a dream
const newDream = await createDream({
  title: 'My Project',
  description: 'Project description',
  status: 'idea',
  tags: ['react', 'ai']
})

// Add a fragment
await createFragment({
  dream_id: newDream.id,
  title: 'Initial Concept',
  content: 'Conversation content here...'
})
```

---

## Components

### Form Components

#### DreamForm

Form for creating/editing dreams.

```jsx
<DreamForm
  dream={existingDream}  // Optional: existing dream data
  onSave={handleSave}
  onCancel={handleCancel}
  statuses={STATUS_OPTIONS}
/>
```

#### FragmentForm

Form for creating fragments.

```jsx
<FragmentForm
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

#### TodoForm

Form for creating/editing todos.

```jsx
<TodoForm
  todo={existingTodo}  // Optional: existing todo data
  onSave={handleSave}
  onCancel={handleCancel}
  taskCategories={CATEGORIES}
/>
```

### Layout Components

#### Modal

Modal overlay component.

```jsx
<Modal onClose={handleClose}>
  <h2>Modal Title</h2>
  <p>Modal content...</p>
</Modal>
```

### Feature Components

#### AIAssistant

AI-powered suggestions component.

```jsx
<AIAssistant
  dream={currentDream}
  type="tags"  // or "summary"
  onSuggestionsApplied={handleApply}
/>
```

#### DocumentUpload

Document upload and parsing component.

```jsx
<DocumentUpload
  dreamId={dream.id}
  onDocumentParsed={handleParsed}
/>
```

#### ErrorBoundary

Error boundary for graceful error handling.

```jsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

## Performance Optimizations

All components use `React.memo` to prevent unnecessary re-renders:

```javascript
const DreamForm = React.memo(function DreamForm({ ... }) {
  // Component logic
})
```

This ensures that components only re-render when their props change.
