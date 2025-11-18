# Dreamcatcher Mobile App

**Quick capture app for ideas on the go**

Built with React Native and Expo for iOS and Android.

## Features

- 📱 **Quick Capture**: Add fragments in seconds
- 💭 **Offline Support**: Capture even without internet
- 🔄 **Auto Sync**: Automatically syncs when online
- 📸 **Photo Capture**: Add photos to fragments
- 🔔 **Push Notifications**: Reminders for dream deadlines
- 🌙 **Dark Mode**: Easy on the eyes

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator

## Installation

```bash
cd apps/mobile
npm install
```

## Development

```bash
# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## Build for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

## Project Structure

```
apps/mobile/
├── App.tsx                 # Main app entry
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── DreamsListScreen.tsx
│   │   ├── DreamDetailScreen.tsx
│   │   ├── QuickCaptureScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/        # Reusable components
│   │   ├── DreamCard.tsx
│   │   ├── FragmentCard.tsx
│   │   └── TodoItem.tsx
│   ├── services/          # API and services
│   │   ├── api.ts
│   │   └── offline-queue.ts
│   ├── context/           # React contexts
│   │   └── AuthContext.tsx
│   └── utils/             # Utilities
│       └── date.ts
├── assets/                # Images, fonts, etc.
└── app.json              # Expo configuration
```

## Key Screens

### QuickCaptureScreen
Fast fragment capture interface with:
- Dream selection
- Title and content input
- Offline queue support
- Auto-sync when online

### HomeScreen
Dashboard showing:
- Active dreams count
- Recent fragments
- Quick capture button
- Sync status

### DreamsListScreen
Browse all dreams with:
- Filter by status
- Search
- Sort options
- Pull to refresh

### DreamDetailScreen
View dream details:
- Fragments timeline
- Todos checklist
- Progress stats
- Edit dream

## Offline Support

The app uses AsyncStorage and a sync queue to support offline usage:

```typescript
// Offline queue automatically syncs when connection restored
await OfflineQueue.add('createFragment', {
  dreamId: 'dream-123',
  title: 'My idea',
  content: 'Great thought'
});
```

## Push Notifications

Set up push notifications for todo deadlines:

```bash
# Configure in app.json
{
  "notification": {
    "icon": "./assets/notification-icon.png",
    "color": "#667eea"
  }
}
```

## Environment Variables

Create `.env` file:

```
API_URL=https://api.dreamcatcher.app
WS_URL=wss://ws.dreamcatcher.app
```

## Testing

```bash
npm test
```

## Publishing

### iOS App Store

1. Configure app signing in Xcode
2. Build: `expo build:ios`
3. Upload to App Store Connect
4. Submit for review

### Google Play Store

1. Generate keystore
2. Build: `expo build:android`
3. Upload to Google Play Console
4. Submit for review

## Contributing

See main project [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

See [LICENSE](../../LICENSE)
