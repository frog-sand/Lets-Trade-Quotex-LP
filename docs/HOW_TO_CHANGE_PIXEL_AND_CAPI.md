# 📝 How to Change Facebook Pixel and CAPI Settings

## 📍 File Location

For **each landing page**, edit the `index.html` file:
- Example: `sites/Pink/index.html`
- Example: `sites/Grey/index.html`
- Example: `sites/Blue/index.html`

## 🔧 What to Change

### 1️⃣ Facebook Pixel ID (3 Places)

You need to change the Pixel ID in **3 locations** in each `index.html` file:

#### Location 1: Line ~27 (Pixel Initialization)
```javascript
fbq('init', '1498315231226863');  // ← Change this Pixel ID
```

**Find this code around line 27:**
```javascript
window.fbAsyncInit = function() {
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1498315231226863');  // ← CHANGE HERE (Line ~27)
  fbq('track', 'PageView');
};
```

#### Location 2: Line ~39 (Noscript Image)
```html
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1498315231226863&ev=PageView&noscript=1"/>
```

**Find this code around line 39:**
```html
<noscript>
  <img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=1498315231226863&ev=PageView&noscript=1"/>
  <!-- Change the ID in the src URL ↑ (Line ~39) -->
</noscript>
```

#### Location 3: Verify handleCTAClick Function (Optional)
The handleCTAClick function uses `fbq('track', 'Subscribe')` - this uses the Pixel ID from Location 1, so no change needed here.

---

### 2️⃣ CAPI Server URL (1 Place)

#### Location: Line ~938 (CAPI Configuration)
```javascript
const CAPI_SERVER_URL = 'https://letstradequotex.com/api/track';  // ← Change this URL
```

**Find this code around line 938:**
```javascript
<script>
  // CAPI Server URL and Landing Page Name
  const CAPI_SERVER_URL = 'https://letstradequotex.com/api/track';  // ← CHANGE HERE
  const LANDING_PAGE_NAME = 'Pink2.0';  // Optional: change page name for tracking
```

---

### 3️⃣ Landing Page Name (1 Place) - Optional

#### Location: Line ~939 (Page Identifier)
```javascript
const LANDING_PAGE_NAME = 'Pink2.0';  // ← Change this name for tracking
```

This helps you identify which page sent events in your CAPI server logs.

**Examples:**
- Pink page: `'Pink2.0'`
- Grey page: `'Grey'`
- Blue page: `'Blue'`
- Custom name: `'Christmas_Campaign'`

---

## 📋 Quick Change Checklist

For **each landing page** you want to modify:

### Changing Facebook Pixel:
- [ ] Line ~27: Change `fbq('init', 'PIXEL_ID')`
- [ ] Line ~39: Change pixel ID in `<img src="...?id=PIXEL_ID..."/>`
- [ ] Test: Open Facebook Events Manager to verify events are tracked

### Changing CAPI Server:
- [ ] Line ~938: Change `const CAPI_SERVER_URL = 'YOUR_SERVER_URL'`
- [ ] Line ~939: Change `const LANDING_PAGE_NAME = 'PAGE_NAME'` (optional)
- [ ] Test: Check your CAPI server logs to verify events are received

---

## 🔍 How to Find These Lines

### Method 1: Search in File
1. Open `sites/[ColorName]/index.html` in your code editor
2. Press `Ctrl+F` (or `Cmd+F` on Mac)
3. Search for:
   - `fbq('init'` → to find Pixel ID
   - `CAPI_SERVER_URL` → to find CAPI server
   - `LANDING_PAGE_NAME` → to find page name

### Method 2: Line Numbers
Open the file and go to these approximate line numbers:
- **Line 27** → Pixel initialization
- **Line 39** → Noscript pixel
- **Line 938** → CAPI server URL
- **Line 939** → Landing page name

---

## 📝 Example: Changing Pink Landing Page

### Step 1: Open the file
```
sites/Pink/index.html
```

### Step 2: Find and replace Pixel ID

**OLD:**
```javascript
fbq('init', '1498315231226863');
```

**NEW:**
```javascript
fbq('init', 'YOUR_NEW_PIXEL_ID');
```

**Also update in noscript:**
```html
<!-- OLD -->
<img src="https://www.facebook.com/tr?id=1498315231226863&ev=PageView&noscript=1"/>

<!-- NEW -->
<img src="https://www.facebook.com/tr?id=YOUR_NEW_PIXEL_ID&ev=PageView&noscript=1"/>
```

### Step 3: Update CAPI Server (if needed)

**OLD:**
```javascript
const CAPI_SERVER_URL = 'https://letstradequotex.com/api/track';
const LANDING_PAGE_NAME = 'Pink2.0';
```

**NEW:**
```javascript
const CAPI_SERVER_URL = 'https://YOUR-NEW-SERVER.com/api/track';
const LANDING_PAGE_NAME = 'Pink_NewCampaign';
```

### Step 4: Save and test!

---

## 🎯 Different Pixels for Different Pages

You can use different Pixel IDs for different landing pages:

**Example:**
- **Pink page** → Pixel ID: `123456789` (Campaign A)
- **Grey page** → Pixel ID: `987654321` (Campaign B)
- **Blue page** → Pixel ID: `123456789` (Campaign A - same as Pink)

Just change the Pixel ID in each page's `index.html` file accordingly.

---

## ⚠️ Important Notes

1. **Both Pixel and CAPI track independently**
   - Facebook Pixel tracks on browser (client-side)
   - CAPI tracks on server (server-side)
   - Both can work together for better tracking

2. **Test after changing**
   - Open Facebook Events Manager
   - Open your landing page
   - Verify PageView event is tracked
   - Click a button and verify Subscribe event is tracked

3. **Same changes for all 16 landing pages**
   - Each landing page has its own `index.html`
   - Same line numbers for all pages
   - Change each one individually if using different pixels

4. **CAPI Server must be running**
   - CAPI tracking won't work if server is down
   - But page will still load fast (non-blocking)
   - Facebook Pixel still works independently

---

## 🚀 Quick Reference Card

| What to Change | Where | Approximate Line |
|---|---|---|
| **Facebook Pixel ID #1** | `fbq('init', 'ID')` | ~27 |
| **Facebook Pixel ID #2** | `<img src="...?id=ID...">` | ~39 |
| **CAPI Server URL** | `const CAPI_SERVER_URL = 'URL'` | ~938 |
| **Page Name** | `const LANDING_PAGE_NAME = 'NAME'` | ~939 |

---

## 📁 File Structure

```
sites/
├── Pink/
│   └── index.html       ← Change pixel/CAPI here for Pink page
├── Grey/
│   └── index.html       ← Change pixel/CAPI here for Grey page
├── Blue/
│   └── index.html       ← Change pixel/CAPI here for Blue page
├── Coral/
│   └── index.html       ← Change pixel/CAPI here for Coral page
... (and so on for all 16 pages)
```

---

## ✅ Testing Checklist

After making changes:

### Facebook Pixel Test:
- [ ] Open Facebook Events Manager
- [ ] Open your landing page
- [ ] See PageView event (should appear within 20 seconds)
- [ ] Click "Get Started" button
- [ ] See Subscribe event
- [ ] Correct Pixel ID shown in Events Manager

### CAPI Test:
- [ ] Check CAPI server logs
- [ ] See PageView event received
- [ ] Click "Get Started" button
- [ ] See Subscribe event received
- [ ] Correct landing page name in logs

---

Need help? Just ask! 🙂