# 📱 PWA Support - Doctor Simulator

## מה זה PWA?
**Progressive Web App** היא אפליקציה שנראית ותופעלת כמו native app, אך תוכנתה בטכנולוגיות web.

## תכונות PWA שהוסיפו:

### 1️⃣ **Installation** 
- ✅ כפתור "הוסף לבית" בחלק העליון
- ✅ Standalone mode - בלי URL bar
- ✅ Apple iOS support
- ✅ Android support  
- ✅ Windows desktop support

### 2️⃣ **Offline Support**
- ✅ Service Worker caching
- ✅ עובד ללא חיבור אינטרנט
- ✅ Automatic cache updates
- ✅ Background sync when reconnected

### 3️⃣ **Performance**
- ✅ מהיר מאד - סטטי מטמון מאד
- ✅ Lazy loading של תמונות
- ✅ CDN caching עבור Leaflet
- ✅ Gzip compression

### 4️⃣ **Push Notifications** (optional)
- ✅ Server-side push support
- ✅ Background notification handling

## 📁 קבצים חדשים:

```
manifest.json           - Metadata עבור ההתקנה
service-worker.js      - Offline support + caching
browserconfig.xml      - Windows tile configuration
PWA-README.md         - קובץ זה
```

## 📋 עדכונים ב-index.html:

1. **Meta tags** לתמיכה ב-PWA:
   - `manifest` link
   - `theme-color`
   - `apple-mobile-web-app-*` tags
   - `application-name`

2. **Favicon & Icons**:
   - `apple-touch-icon` - iOS
   - `icon` - browsers

3. **Install Button**:
   - `<button id="installBtn">` בחלק העליון
   - JavaScript event handlers

4. **Service Worker Registration**:
   ```javascript
   if ('serviceWorker' in navigator) {
       navigator.serviceWorker.register('service-worker.js');
   }
   ```

## 🚀 איך משתמשים:

### On Mobile (iOS/Android):
1. פתח את האתר בדפדפן
2. לחץ על "הוסף לבית" (iOS) או אפליקציה (Android)
3. בחר "Add to Home Screen"
4. לחץ "Add"

### On Desktop (Chrome/Edge):
1. לחץ על כפתור ההתקנה בחלק העליון
2. או לחץ ימני על tab > "Install app"

## 📊 Caching Strategy:

### Static Assets (Cache First)
- HTML files
- CSS/JS
- Images
- Manifest

### HTML Pages (Network First)
- Main page
- Data pages

### API Calls (Network First with Fallback)
- METAR data
- Google Sheets
- Background sync

## 🔒 Security:

- ✅ HTTPS required for PWA
- ✅ Service Worker limited to same origin
- ✅ No sensitive data in cache
- ✅ Automatic cache cleanup

## 📦 קבצים להעלות לשרver:

```
✅ index.html              (עדכון)
✅ manifest.json           (חדש)
✅ service-worker.js       (חדש)
✅ browserconfig.xml       (חדש)
✅ data_sources.html       (כבר יש)
✅ fetch-metar.php         (כבר יש)
✅ save-data.php          (כבר יש)
✅ logo.png               (כבר יש)
```

## ✅ Testing PWA:

1. **Chrome DevTools**:
   - Ctrl+Shift+J (Console)
   - בדוק בשורה הראשונה של Service Worker registration

2. **Lighthouse Audit**:
   - Ctrl+Shift+J > Lighthouse tab
   - Run audit
   - בדוק PWA score

3. **Offline Testing**:
   - DevTools > Network > Offline
   - אפליקציה צריכה להיות פעילה

## 🐛 Troubleshooting:

**"Service Worker registration failed"**
- בדוק HTTPS
- בדוק את console for errors

**"Install button not showing"**
- צריך HTTPS
- צריך manifest.json valid
- צריך icon בכל גדלים

**"Offline mode not working"**
- נקה את cache
- עדכן את service-worker.js
- reload page

## 📝 Notes:

- PWA עובד הכי טוב על מכשירים mobile
- Desktop version זה יותר עבור convenience
- Offline mode עובד עם cached data בלבד
- Background sync יעבוד כשחוזרים online

