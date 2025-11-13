# Dreamcatcher Scripts

Utility scripts for development and deployment.

## 🚀 Development Scripts

### `start-dev.bat`
Start the Vite development server.

```bash
.\scripts\start-dev.bat
```

**What it does:**
- Runs `npm run dev`
- Starts development server on http://localhost:3100
- Enables hot module replacement (HMR)

---

## 🔧 Setup Scripts

### `setup.bat`
Initial project setup.

```bash
.\scripts\setup.bat
```

**What it does:**
- Installs npm dependencies
- Sets up environment
- Prepares project for development

---

## 📚 Documentation Scripts

### `organize-docs.ps1`
Organize documentation files into structured folders.

```powershell
.\scripts\organize-docs.ps1
```

**What it does:**
- Creates `docs/` subdirectories (planning, setup, architecture, marketing, sessions)
- Moves all documentation files to appropriate folders
- Maintains clean root directory
- Follows professional repository structure

**Categories:**
- `docs/planning/` - Roadmaps, feature specs, migration plans
- `docs/setup/` - Installation, troubleshooting, Git workflow
- `docs/architecture/` - System design, ecosystem vision
- `docs/marketing/` - Brand strategy, launch materials
- `docs/sessions/` - Development logs

---

## 📦 Git Scripts

### `setup-git.bat` (Windows Command Prompt)
Initialize Git repository and create branch structure.

```bash
.\scripts\setup-git.bat
```

### `setup-git.ps1` (PowerShell - Recommended)
Initialize Git repository with verbose output and error handling.

```powershell
.\scripts\setup-git.ps1
```

**What they do:**
- Initialize Git repository
- Create branches: `main`, `develop`, `feature-2.2`
- Add remote origin
- Prepare for GitHub push

**Git Flow**:
```
feature-2.2 (active development)
    ↓ merge
develop (integration)
    ↓ merge
main (production)
```

---

## 📝 Usage Notes

### Running Scripts

**From Project Root:**
```bash
# Windows Command Prompt
.\scripts\script-name.bat

# PowerShell
.\scripts\script-name.ps1
```

**Directly in Scripts Folder:**
```bash
cd scripts
.\script-name.bat
```

### Script Requirements

- **Node.js**: v18+ required
- **npm**: Comes with Node.js
- **Git**: For git scripts
- **PowerShell**: For .ps1 scripts

---

## 🛠️ Creating New Scripts

When adding new scripts:

1. Place in this `scripts/` folder
2. Use `.bat` for Command Prompt
3. Use `.ps1` for PowerShell (preferred for complex logic)
4. Add documentation here
5. Make scripts executable
6. Add comments in the script itself

**Script Template:**
```batch
@echo off
REM Script Name - Brief description
REM Usage: script-name.bat

echo Starting script...
REM Your commands here
echo Done!
```

---

## 📋 Available Scripts

| Script | Purpose | Platform |
|--------|---------|----------|
| `start-dev.bat` | Start dev server | Windows |
| `setup.bat` | Initial setup | Windows |
| `organize-docs.ps1` | Organize documentation | PowerShell |
| `setup-git.bat` | Git initialization | Windows CMD |
| `setup-git.ps1` | Git initialization | PowerShell |

---

*For more information, see the main [README.md](../README.md)*

