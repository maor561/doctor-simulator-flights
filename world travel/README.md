# ✈️ Doctor Simulator - Flight Management System

A Progressive Web App (PWA) for managing and tracking flight routes worldwide with real-time METAR weather data and interactive mapping.

## 🌟 Features

### Core Features
- **Interactive Map** - Leaflet-based map with route visualization
- **47+ Flight Routes** - Global routes from a Google Sheet
- **Real-time METAR** - Weather data from VATSIM API
- **Offline Support** - Full offline functionality with service worker caching
- **RTL Layout** - Full Hebrew language support

### PWA Features
- 📱 **Installable** - Add to home screen on mobile & desktop
- 🔄 **Offline Mode** - Works without internet connection
- 🔐 **Secure** - HTTPS required, no sensitive data stored
- ⚡ **Fast** - Instant load from cache
- 🎨 **Beautiful Icon** - SVG globe with airplanes

### Data Sources
- **Route Codes**: Google Sheets (ICAO codes)
- **Airport Info**: Built-in database (~70 airports)
- **Flight Times**: Calculated via Haversine formula
- **Weather**: VATSIM METAR API
- **Coordinates**: Built-in DB + fallback to country centers

## 🚀 Deployment

### Vercel + GitHub CI/CD

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USER/doctor-simulator-flights.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/import
   - Connect GitHub repository
   - Click "Deploy"
   - Auto-deploys on every push to `main`!

3. **Set Environment Variables** (Optional)
   ```
   ADMIN_PASSWORD=your_password
   ```

## 📁 Project Structure

```
.
├── index.html              # Main application
├── data_sources.html       # Data sources reference page
├── manifest.json           # PWA configuration
├── service-worker.js       # Offline support & caching
├── globe-icon.svg          # PWA app icon
├── logo.png                # Logo image
├── browserconfig.xml       # Windows tile config
├── vercel.json            # Vercel configuration
├── api/
│   ├── metar.js           # METAR data API
│   └── save-data.js       # Route completion API
├── fetch-metar.php        # Legacy PHP (can be removed)
└── save-data.php          # Legacy PHP (can be removed)
```

## 🛠️ Local Development

### With Vercel CLI
```bash
npm i -g vercel
vercel dev
```

### Direct with Node.js
```bash
python -m http.server 8000
# or
npx http-server
```

Visit: http://localhost:8000

## 🗄️ Database (Optional)

### Vercel Postgres
```bash
# Add via Vercel dashboard or CLI
vercel env add POSTGRES_URL
```

### Update APIs to use database
```javascript
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const result = await sql`SELECT * FROM routes`;
    return res.json(result);
}
```

## 📊 METAR Updates

Automatic updates every 6 hours via Vercel Cron:
```
GET /api/cron/metar
```

## 🔐 Admin Features

Password protection for:
- Marking routes as complete
- Resetting route data

Password: Set via environment variable `ADMIN_PASSWORD`

## 📱 Install on Devices

### iPhone/iPad
1. Open Safari
2. Tap Share → "Add to Home Screen"
3. Name it → Add

### Android
1. Open Chrome
2. Menu → "Install app"
3. Confirm

### Windows/Mac
1. Open Chrome
2. Click install icon (top right)
3. Confirm

## 🔄 Auto-Deploy Workflow

1. Edit files locally
2. Commit to git
3. Push to main branch
4. Vercel automatically deploys!

```bash
git add .
git commit -m "Update routes"
git push origin main
# ✅ Vercel deploys automatically
```

## 📈 Monitoring

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Logs**: View in Vercel > Project > Logs
- **Analytics**: Vercel > Project > Analytics

## 🐛 Troubleshooting

### PWA not installing?
- Check HTTPS is working
- Clear browser cache (Ctrl+Shift+Delete)
- Check manifest.json is valid

### Routes not showing?
- Check DevTools > Application > Service Workers
- Verify manifest and icon paths
- Check localStorage in DevTools

### METAR not updating?
- Check API endpoint: `/api/metar?icao=LLBG`
- Verify VATSIM API is accessible
- Check Vercel logs for errors

## 📝 License

MIT License - Feel free to use for personal and commercial projects.

## 👨‍💻 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Push to GitHub
5. Create Pull Request

---

**Deployed on**: Vercel  
**Repository**: https://github.com/YOUR_USER/doctor-simulator-flights  
**Live URL**: https://doctor-simulator-flights.vercel.app
