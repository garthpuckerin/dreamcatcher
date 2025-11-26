# Testing Guide

## Overview

Dreamcatcher uses **Vitest** as the testing framework with **React Testing Library** for component tests. We maintain comprehensive test coverage for all critical paths.

## Test Statistics

- **Total Tests**: 122
- **Hooks Coverage**: 98% (useAuth), 91% (useAI), 81% (useDreams)
- **Components Coverage**: 83-97%

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- useAuth.test.js
```

## Test Structure

```
src/
├── hooks/
│   └── __tests__/
│       ├── useAuth.test.js (27 tests)
│       ├── useAI.test.js (15 tests)
│       └── useDreams.test.js (26 tests)
└── components/
    ├── __tests__/
    │   ├── AIAssistant.test.jsx (8 tests)
    │   ├── DocumentUpload.test.jsx (8 tests)
    │   └── ErrorBoundary.test.jsx (2 tests)
    ├── Forms/__tests__/
    │   ├── DreamForm.test.jsx (11 tests)
    │   ├── FragmentForm.test.jsx (11 tests)
    │   └── TodoForm.test.jsx (9 tests)
    └── Layout/__tests__/
        └── Modal.test.jsx (5 tests)
```

## Writing Tests

### Hook Tests

Use `renderHook` from `@testing-library/react`:

```javascript
import { renderHook, waitFor, act } from '@testing-library/react'

it('should create a dream', async () => {
  const { result } = renderHook(() => useDreams())

  await act(async () => {
    await result.current.createDream({ title: 'Test' })
  })

  expect(result.current.dreams).toHaveLength(1)
})
```

### Component Tests

Use `render` and `screen` from `@testing-library/react`:

```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('handles user input', async () => {
  const user = userEvent.setup()
  render(<DreamForm onSave={vi.fn()} />)

  await user.type(screen.getByPlaceholderText(/title/i), 'New Dream')
  expect(screen.getByPlaceholderText(/title/i)).toHaveValue('New Dream')
})
```

## Mocking

### Supabase Mocking

```javascript
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      // ... other methods
    })
  }
}))
```

### Hook Mocking

```javascript
vi.mock('../../hooks/useAI')

vi.mocked(useAI).mockReturnValue({
  aiAvailable: true,
  generateSummary: vi.fn().mockResolvedValue('Summary'),
  // ... other methods
})
```

## Best Practices

1. **Test user behavior**, not implementation details
2. **Use semantic queries** (`getByRole`, `getByLabelText`) over `getByTestId`
3. **Wait for async operations** using `waitFor` or `act`
4. **Clear mocks** in `beforeEach` to avoid test interdependence
5. **Test edge cases**: empty states, error states, loading states
6. **Mock external dependencies**: API calls, browser APIs, third-party libraries

## Coverage Goals

- **Critical paths**: 90%+ coverage
- **Business logic**: 80%+ coverage
- **UI components**: 70%+ coverage
- **Overall project**: 60%+ coverage

## CI/CD Integration

Tests run automatically on:
- Every push to `main` and `develop`
- Every pull request
- Multiple Node versions (18.x, 20.x)

Coverage reports are uploaded to Codecov and commented on PRs.
