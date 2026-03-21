# Changelog - Doctor Simulator Flights

All notable changes to this project will be documented in this file.

---

## [v2.1] - 2026-03-21 🚀 IN DEVELOPMENT

### 🎯 Planned Features

#### User Interface Enhancements
- [ ] Dark mode support
- [ ] Route filtering & search
- [ ] Statistics dashboard
- [ ] Route history view

#### Data & Storage
- [ ] User authentication system
- [ ] Cloud backup feature
- [ ] Data export/import (JSON, CSV)
- [ ] Automatic daily backups

#### Advanced Features
- [ ] Real-time flight tracking
- [ ] Route recommendations based on weather
- [ ] Multi-user support
- [ ] Custom route creation

#### Performance
- [ ] Optimize bundle size
- [ ] Image compression
- [ ] Caching improvements
- [ ] Database migration (from file to proper DB)

---

## [v2.0] - 2026-03-21 🔄 MAJOR UPDATE - Cross-Device Data Sync

### ✨ New Features

#### Data Persistence & Synchronization
- 💾 **Server-side data storage** - Routes data now syncs across devices
- 📱 **Multi-device sync** - Save on desktop, access on mobile
- 🔐 **Persistent storage** - Data saved to server (`/tmp/doctor-simulator-data.json`)
- 🌐 **Incognito & new tabs** - Data accessible everywhere

#### Enhanced API
- 🔄 Updated `/api/save-data` endpoint with GET/POST support
- 📡 Automatic server fallback - Works offline with localStorage

### 🐛 Bug Fixes

- ✅ Fixed date/time not persisting after page refresh
- ✅ Fixed data not syncing across tabs/devices/sessions
- ✅ Fixed initialization order (loadFromServer before render)
- ✅ Fixed METAR data not displaying on initial load

### ⚙️ Improvements

- 📊 Better error handling in data loading
- 🔄 Async data loading with proper await chains
- 💪 Fallback mechanism: Server → localStorage → empty
- 🧹 Cleaner initialization sequence

### 📋 Technical Details

- Made `loadFromServer()` async
- Added server-side file storage for cross-device persistence
- Updated initialization to call `loadFromServer()` before `render()`
- Added comprehensive fallback chain for offline support

---

## [v1.0] - 2026-03-19 ✨ RELEASE

### ✅ Features

#### Core Application
- 🗺️ Interactive Leaflet map with route visualization
- 📍 47+ global flight routes with real-time display
- 🌍 Built-in airport database (~70 airports worldwide)
- 📡 Real-time METAR weather data from VATSIM API
- ⏱️ Dynamic flight time calculation (Haversine formula)
- 🇮🇱 Full Hebrew (RTL) language support

#### Progressive Web App (PWA)
- 📱 Installable on mobile & desktop
- 🔄 Offline support with service worker
- 💾 Smart localStorage caching
- 🎨 Custom globe icon (SVG)
- ⚡ Fast loading from cache

#### Deployment & DevOps
- 🚀 Vercel hosting with global CDN
- 🔗 GitHub integration with auto-sync
- 🔄 Auto-push Git hook (commit → push)
- 🚀 Auto-deploy on every push
- 🔐 HTTPS + security headers
- 📊 Built-in analytics

#### API Endpoints
- 📡 `/api/metar` - METAR weather data
- 💾 `/api/save-data` - Route completion tracking

#### Data Sources
- 📊 **Routes**: Google Sheets (ICAO codes)
- 📦 **Airport Info**: Built-in database
- 📐 **Flight Times**: Calculated (Haversine)
- 🌍 **Fallback**: Country center coordinates

### 🛠️ Technical Stack

- **Frontend**: HTML5 + JavaScript (vanilla)
- **Mapping**: Leaflet.js
- **Hosting**: Vercel (static + serverless)
- **Version Control**: GitHub
- **PWA**: Service Workers + Manifest
- **API**: Vercel Edge Functions (Node.js)

### 📦 Project Structure

```
doctor-simulator-flights/
├── index.html                    # Main application
├── data_sources.html             # Data reference
├── manifest.json                 # PWA config
├── service-worker.js             # Offline support
├── globe-icon.svg               # PWA icon
├── vercel.json                  # Vercel config
├── package.json                 # Dependencies
├── api/
│   ├── metar.js                # METAR endpoint
│   └── save-data.js            # Data save endpoint
├── README.md                    # Documentation
└── CHANGELOG.md                 # This file
```

### 🚀 Deployment

- **Live URL**: https://doctor-simulator-flights.vercel.app
- **Repository**: https://github.com/maor561/doctor-simulator-flights
- **Branch**: main (auto-deploys)

### 📝 Usage

1. **Install as app**:
   - Desktop: Click install icon
   - Mobile: Menu → Install app

2. **View routes**:
   - All 47 routes visible on map
   - Click LEG to zoom to route
   - View real-time METAR data

3. **Update workflow**:
   ```bash
   git add .
   git commit -m "Update: description"
   git push  # Auto-deploys!
   ```

### 🐛 Known Limitations

- Some airports may not be in built-in database (fallback to country center)
- METAR data updates every 6 hours
- Limited to 47 routes from Google Sheet

### ✨ Future Improvements

- Database integration (Vercel Postgres)
- Real-time flight tracking
- Advanced weather visualization
- Multi-language support
- Admin dashboard

---

## Release Notes

### v1.0 (Initial Release)
- ✅ Full PWA functionality
- ✅ 47 flight routes
- ✅ Real-time METAR
- ✅ Auto-deploy CI/CD
- ✅ Offline mode
- ✅ Mobile responsive
- ✅ Hebrew RTL

**Status**: Production Ready ✅

---

## Contributing

For future versions, follow this workflow:

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test locally
4. Commit: `git commit -m "Feature: description"`
5. Push: `git push origin feature/name`
6. Create Pull Request on GitHub
7. Merge to main
8. Auto-deploy via Vercel!

---

**Deployed on**: Vercel
**Repository**: GitHub (maor561/doctor-simulator-flights)
**Live**: https://doctor-simulator-flights.vercel.app

Last Updated: 2026-03-19
