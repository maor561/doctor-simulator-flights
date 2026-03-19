# Changelog - Doctor Simulator Flights

All notable changes to this project will be documented in this file.

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
