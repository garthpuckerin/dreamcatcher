# 🚀 Quick Setup - Dreamcatcher Web App

## The Problem You're Seeing

```
'vite' is not recognized as an internal or external command
```

This happens because the dependencies (React, Vite, etc.) haven't been installed yet.

---

## ✅ Solution - Install Dependencies

### Option 1: Use Setup Script (Easiest)

Double-click the file: **`setup.bat`**

This will:
1. Install all dependencies
2. Set up node_modules
3. Prepare the app to run

### Option 2: Manual Command

In PowerShell or Command Prompt:

```powershell
cd C:\MPGWorldwide\dreamcatcher
npm install
```

Wait for it to complete (may take 1-2 minutes).

---

## 🎯 After Installation

### Start the Dev Server

**Option A:** Double-click **`start-dev.bat`**

**Option B:** Run in terminal:
```powershell
npm run dev
```

The app will open at: **http://localhost:3100**

---

## 🔍 Troubleshooting

### "npm is not recognized"

Node.js isn't installed or not in PATH.

**Fix:**
1. Download Node.js from https://nodejs.org
2. Install (includes npm)
3. Restart your terminal
4. Try again

### Installation takes forever

This is normal! First install can take 1-3 minutes.

Dependencies being installed:
- React (18.2.0)
- React DOM (18.2.0)
- Lucide React (0.294.0)
- Vite (5.0.8)
- Plus their dependencies (~200 packages)

### Port 3100 already in use

Edit `vite.config.js` and change the port:

```javascript
server: {
  port: 3200, // Change to any available port
  open: true
}
```

### Still getting errors?

Check:
1. ✅ You're in the correct directory (`C:\MPGWorldwide\dreamcatcher`)
2. ✅ `package.json` exists in that directory
3. ✅ You have internet connection (npm downloads packages)
4. ✅ No firewall blocking npm

---

## 📦 What Gets Installed

After `npm install`, you'll see:

```
C:\MPGWorldwide\dreamcatcher\
├── node_modules/          ← NEW! ~200 packages
├── package-lock.json      ← NEW! Lock file
├── src/
├── index.html
├── package.json
└── vite.config.js
```

The `node_modules` folder will be ~150-200 MB.

---

## ✨ Once Running

You'll see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3100/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Browser opens automatically to **http://localhost:3100**

---

## 🎉 Success Indicators

When it's working, you'll see:
- ✨ Dreamcatcher dashboard
- Sample dreams in the sidebar
- Beautiful dark UI
- No console errors

---

## 📝 Common Commands

```powershell
# Install dependencies (run once)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🆘 Still Stuck?

1. Delete `node_modules` folder (if it exists)
2. Delete `package-lock.json` (if it exists)
3. Run `npm install` again
4. If that fails, check Node.js version:
   ```powershell
   node --version  # Should be v14 or higher
   npm --version   # Should be v6 or higher
   ```

---

**Need more help?** Check:
- `README.md` - Full documentation
- `SETUP_COMPLETE.md` - Detailed setup guide
- `PROJECT_PLAN.md` - Project overview

---

**Ready?** Double-click `setup.bat` now! 🚀

