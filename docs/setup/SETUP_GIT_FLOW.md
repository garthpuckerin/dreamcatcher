# Git Flow Setup for Dreamcatcher

## Current Situation
We need to establish proper Git flow with:
- `main` - Production branch
- `develop` - Integration branch
- `feature-2.2` - Active feature branch

## Setup Commands

Run these commands in order:

```bash
# 1. Verify current branch structure
git branch -a

# 2. Delete the old develop branch if it exists
git branch -D develop

# 3. Ensure we're on main (renamed from feature-2.2)
git checkout main

# 4. Create develop from main
git branch develop

# 5. Create feature-2.2 from develop
git checkout develop
git checkout -b feature-2.2

# 6. Add remote with correct username
git remote add origin https://github.com/garthpuckerin/dreamcatcher.git

# 7. Push all branches
git push -u origin main
git push -u origin develop
git push -u origin feature-2.2

# 8. Set feature-2.2 as default branch (optional, do in GitHub UI)
```

## Verification

After setup, verify with:
```bash
git branch -a
git remote -v
```

You should see:
```
* feature-2.2
  develop
  main
  remotes/origin/feature-2.2
  remotes/origin/develop
  remotes/origin/main
```

## Git Flow

```
feature-2.2 (work here)
    ↓
  merge
    ↓
develop (integration)
    ↓
  merge
    ↓
main (production)
```

## Daily Workflow

### Starting New Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Completing Feature
```bash
git checkout develop
git merge feature/your-feature-name
git push origin develop
git branch -d feature/your-feature-name
```

### Releasing to Production
```bash
git checkout main
git merge develop
git tag -a v2.1.0 -m "Release v2.1.0"
git push origin main --tags
```

