# Dreamcatcher Browser Extension

**Capture ChatGPT and Claude conversations directly into your Dreamcatcher dreams.**

## Features

- **🎯 One-Click Capture**: Save entire AI conversations with a single click
- **🤖 Multi-Platform**: Works on ChatGPT, Claude, and Anthropic's chat interfaces
- **📦 Offline Queue**: Capture conversations even when offline, sync later
- **🔍 Auto-Detection**: Automatically detects project context from conversations
- **⚡ Quick Save**: Right-click to save selected text as fragments
- **🔄 Real-Time Sync**: Automatic synchronization with Dreamcatcher cloud
- **⌨️ Keyboard Shortcuts**: Quick capture with Ctrl+Shift+D (or Cmd+Shift+D)

## Installation

### From Chrome Web Store (Coming Soon)
1. Visit the [Chrome Web Store listing](#)
2. Click "Add to Chrome"
3. Log in with your Dreamcatcher account

### Manual Installation (Development)
1. Clone this repository
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `apps/extension` directory

## Usage

### Capturing Conversations

1. **Navigate to ChatGPT or Claude**: Open any conversation
2. **Click the Dreamcatcher button**: Look for the floating button in the top-right corner
3. **Review and organize**: Choose which dream to add the conversation to
4. **Save**: Click "Save Online" (requires internet) or "Save Offline" (sync later)

### Quick Selection Save

1. **Select text**: Highlight any text on ChatGPT or Claude
2. **Right-click**: Choose "Save to Dreamcatcher" from context menu
3. **Organize later**: Selection is saved to offline queue

### Managing Offline Queue

1. **Click the extension icon**: Open the popup
2. **View queue**: See pending captures in the "Offline Queue" section
3. **Sync**: Click "Sync Now" when back online

## Architecture

```
apps/extension/
├── manifest.json              # Extension configuration
├── src/
│   ├── content.js            # Runs on ChatGPT/Claude pages
│   ├── background.js         # Service worker (background tasks)
│   ├── popup.html            # Extension popup UI
│   ├── popup.js              # Popup logic
│   └── styles.css            # Injected styles
├── icons/                    # Extension icons
└── README.md                 # This file
```

## Key Components

### Content Script (`content.js`)
- Injected into ChatGPT and Claude pages
- Extracts conversation content
- Adds capture buttons to UI
- Monitors for new messages
- Auto-detects project context

### Background Service Worker (`background.js`)
- Manages extension lifecycle
- Handles offline queue synchronization
- Creates context menu items
- Processes keyboard shortcuts
- Syncs data with Dreamcatcher API

### Popup (`popup.html` + `popup.js`)
- Extension control panel
- Authentication management
- Queue status display
- Recent captures view
- Manual sync controls

## Platform Support

### ChatGPT (chat.openai.com)
- ✅ Message extraction
- ✅ Conversation title
- ✅ User/Assistant role detection
- ✅ Code blocks
- ✅ Markdown formatting

### Claude (claude.ai, chat.anthropic.com)
- ✅ Message extraction
- ✅ Conversation detection
- ✅ User/Assistant role detection
- ✅ Rich formatting support

## Configuration

### Keyboard Shortcuts
- **Capture Conversation**: `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac)
- **Quick Save Selection**: Right-click → "Save to Dreamcatcher"

### Settings
Access settings through the extension popup:
- **Auto-Capture**: Automatically capture conversations periodically
- **Sync Interval**: How often to sync offline queue (default: 30 minutes)
- **Default Dream**: Set a default dream for quick captures

## API Integration

The extension communicates with the Dreamcatcher API:

```javascript
// Authentication
POST /api/auth/login
{ email, password } → { token, user }

// Create Dream
POST /api/dreams
{ title, tags, status } → { id, ... }

// Create Fragment
POST /api/dreams/:id/fragments
{ title, content, type, metadata } → { id, ... }

// List Fragments
GET /api/fragments?limit=5
→ [{ id, title, created_at, metadata, ... }]
```

## Storage Schema

### Chrome Storage (`chrome.storage.local`)

```javascript
{
  // Authentication
  authToken: "jwt_token",
  currentUser: { id, email, name },

  // Offline Queue
  offlineQueue: [
    {
      id: "offline-timestamp",
      conversation: { ... },
      markdown: "# Conversation...",
      dreamTitle: "My Dream",
      dreamTags: ["ai", "project"],
      fragmentTitle: "ChatGPT Discussion",
      timestamp: 1234567890
    }
  ],

  // Recent Dreams (cache)
  dreams: [
    { id, title, status, tags }
  ],

  // Settings
  settings: {
    autoCapture: false,
    syncInterval: 30,
    defaultDreamId: null
  }
}
```

## Development

### Local Testing

```bash
# Install dependencies (if needed)
npm install

# Load extension in Chrome
1. Navigate to chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select apps/extension directory

# Test on ChatGPT/Claude
1. Open https://chat.openai.com or https://claude.ai
2. Start a conversation
3. Click the Dreamcatcher button
4. Check console for logs: [Dreamcatcher] ...
```

### Debugging

- **Content Script Logs**: Open DevTools on ChatGPT/Claude page
- **Background Script Logs**: chrome://extensions/ → "Service worker" → Inspect
- **Popup Logs**: Right-click extension icon → "Inspect popup"

### Building for Production

```bash
# Create production build
npm run build:extension

# Output: dist/extension/
# Ready to upload to Chrome Web Store
```

## Security

- **Authentication**: JWT tokens stored in `chrome.storage.local`
- **HTTPS Only**: All API calls over HTTPS
- **Permissions**: Minimal required permissions
  - `storage`: Store auth tokens and offline queue
  - `activeTab`: Access current tab for capture
  - `scripting`: Inject content scripts
- **Content Security Policy**: Strict CSP in manifest
- **No External Scripts**: All code bundled, no CDN dependencies

## Privacy

- **Local First**: Conversations stored locally until explicitly saved
- **User Control**: User chooses what to capture and when
- **No Tracking**: No analytics or tracking in extension
- **Data Deletion**: Offline queue cleared after successful sync

## Troubleshooting

### Button Not Appearing
- Refresh the ChatGPT/Claude page
- Check if extension is enabled (chrome://extensions/)
- Verify you're on a supported URL

### Capture Failed
- Ensure you're logged in (click extension icon)
- Check internet connection for online save
- Try "Save Offline" instead

### Sync Failed
- Verify you're online
- Re-authenticate in extension popup
- Check Dreamcatcher API status

## Roadmap

- [ ] Firefox support
- [ ] Safari support
- [ ] Auto-capture mode (save all conversations)
- [ ] Conversation search within extension
- [ ] Bulk export conversations
- [ ] Integration with other AI tools (Bard, Bing Chat)
- [ ] Voice memo capture
- [ ] Screenshot annotation

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## License

See [LICENSE](../../LICENSE)

## Support

- **Documentation**: https://docs.dreamcatcher.app/extension
- **Issues**: https://github.com/dreamcatcher/dreamcatcher/issues
- **Email**: support@dreamcatcher.app
