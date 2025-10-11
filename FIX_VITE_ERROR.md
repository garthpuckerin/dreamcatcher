# 🔧 Fix: "vite is not recognized" Error

## The Issue

After running `npm install` successfully, you might still see:
```
'vite' is not recognized as an internal or external command
```

This happens when npm's script runner can't find the local vite executable.

---

## ✅ Solutions (Choose One)

### Solution 1: Use npx (Recommended)

Instead of:
```powershell
npm run dev
```

Use:
```powershell
npx vite
```

`npx` automatically finds executables in `node_modules/.bin/` without PATH issues.

### Solution 2: Update package.json Scripts

The `start-dev.bat` file has been updated to use `npx vite` instead.

**Just double-click `start-dev.bat`** and it will work!

### Solution 3: Run from node_modules Directly

```powershell
.\node_modules\.bin\vite
```

### Solution 4: Clear and Reinstall

If none of the above work:

```powershell
# Remove everything
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json

# Reinstall
npm install

# Run with npx
npx vite
```

---

## 🎯 Quick Start (After npm install)

**Option A:** Double-click **`start-dev.bat`** (now uses npx)

**Option B:** In terminal:
```powershell
npx vite
```

**Option C:** Update package.json and use npm:
```json
"scripts": {
  "dev": "npx vite",
  "build": "npx vite build",
  "preview": "npx vite preview"
}
```

Then run:
```powershell
npm run dev
```

---

## 🌐 Accessing the App

Once running, you'll see:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3100/
```

Open: **http://localhost:3100**

---

## ✨ App is Now Running!

The dev server has been started with `npx vite` in the background.

**Your Dreamcatcher web app should be accessible at:**
**http://localhost:3100**

---

## 🛑 Stopping the Server

To stop the dev server:
- Press **Ctrl+C** in the terminal
- Or close the terminal window

---

## 📝 Why This Happens

- `npm run dev` looks for scripts in PATH
- Windows PowerShell sometimes doesn't add `node_modules/.bin` to PATH correctly
- `npx` solves this by explicitly checking `node_modules/.bin` first

---

## ✅ Verification

Server is running if you see:
- ✅ "VITE ready" message in terminal
- ✅ http://localhost:3100 opens in browser
- ✅ Dreamcatcher dashboard loads
- ✅ No "cannot GET /" errors

---

**Working now?** Start capturing your dreams! ✨

