# Contributing to Dreamcatcher

Thank you for your interest in contributing to Dreamcatcher! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- A code editor (VS Code recommended)

### Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/yourusername/dreamcatcher.git
   cd dreamcatcher
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Run tests (when available):**
   ```bash
   npm test
   ```

## Development Workflow

### Branching Strategy

We follow a feature branch workflow based on `develop`:

- `main` - Production-ready code, tagged releases only
- `develop` - Integration branch for features (currently `feature 2.2`)
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Emergency production fixes

### Creating a Feature Branch

```bash
# Always branch from the latest feature branch (e.g., feature 2.2)
git checkout feature-2.2
git pull origin feature-2.2
git checkout -b feature/your-feature-name
```

### Branch Naming

- `feature/add-cloud-sync` - New features
- `bugfix/fix-todo-completion` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/improve-state-management` - Code refactoring
- `test/add-todo-tests` - Test additions

## Coding Standards

### JavaScript/React

- Use **functional components** with hooks
- Follow **React best practices**
- Use **meaningful variable names**
- Add **JSDoc comments** for complex functions
- Maintain **consistent formatting** (Prettier recommended)

### File Structure

```
src/
├── App_new.jsx         # Main application component
├── main.jsx            # React entry point
├── index.css           # Global styles
└── components/         # Future: Modular components
    ├── AllDreamsView.jsx
    ├── DreamDetailView.jsx
    ├── TodosView.jsx
    └── SummaryView.jsx
```

### Inline Styles

Currently using inline React styles. Future: Consider CSS modules or Tailwind CSS.

### State Management

- Use `useState` for local state
- Use `useEffect` for side effects
- Keep state as close to usage as possible
- Use `localStorage` for persistence (v2.0-2.1)
- Future: Supabase for cloud sync (v2.2+)

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(todos): add deadline picker to todo form

Added a date input for selecting todo deadlines with validation
to ensure deadlines are in the future.

Closes #42
```

```bash
fix(summary): correct overdue todo calculation

Fixed bug where completed todos were counted as overdue.
Updated isOverdue function to check completion status first.
```

### Atomic Commits

- Make **small, focused commits**
- Each commit should be a **logical unit of change**
- Commit **working code** only (must pass tests)

## Pull Request Process

### Before Submitting

1. ✅ **Update from base branch:**
   ```bash
   git checkout feature-2.2
   git pull origin feature-2.2
   git checkout your-feature-branch
   git rebase feature-2.2
   ```

2. ✅ **Test your changes:**
   - Manual testing in browser
   - Run automated tests (when available)
   - Check console for errors
   - Test in multiple browsers (Chrome, Firefox, Safari)

3. ✅ **Update documentation:**
   - Update README if needed
   - Update CHANGELOG.md
   - Add JSDoc comments for new functions

4. ✅ **Lint your code:**
   ```bash
   npm run lint
   ```

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] CHANGELOG updated
```

### PR Review Process

1. **Automated checks** must pass
2. **Code review** by maintainer
3. **Changes requested** (if needed)
4. **Approval** from maintainer
5. **Merge** to base branch

## Testing

### Manual Testing Checklist

For UI changes:
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test responsive design (if applicable)
- [ ] Check browser console for errors
- [ ] Verify localStorage persistence
- [ ] Test with empty state
- [ ] Test with large datasets

For feature changes:
- [ ] Test happy path
- [ ] Test edge cases
- [ ] Test error handling
- [ ] Verify backward compatibility

### Future: Automated Testing

v2.2+ will include:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

## Version Control

### Release Process

1. **Version bump** in `package.json`
2. **Update CHANGELOG.md** with all changes
3. **Tag release**: `git tag -a v2.1.0 -m "Release v2.1.0"`
4. **Push tags**: `git push origin --tags`
5. **Create GitHub release** with notes

### Semantic Versioning

- **MAJOR** (v3.0.0) - Breaking changes
- **MINOR** (v2.1.0) - New features, backward compatible
- **PATCH** (v2.1.1) - Bug fixes, backward compatible

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Dreamcatcher!** 🚀
