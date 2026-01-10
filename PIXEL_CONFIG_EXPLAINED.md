# 📋 pixel-config.js - Do You Need to Change It?

## ❓ Quick Answer

**NO, you DON'T need to change `pixel-config.js` for most cases.**

Here's why:

## 🔍 What is pixel-config.js?

The `pixel-config.js` file is a **centralized configuration** for the **multi-pixel CAPI server** (`server-multi-pixel.js`).

### Current Setup:
- **Your active CAPI server:** `server.js` (single pixel)
- **Alternative server:** `server-multi-pixel.js` (multi pixel - NOT ACTIVE)
- **Configuration file:** `pixel-config.js` (only used by `server-multi-pixel.js`)

### What Your package.json Says:
```json
"scripts": {
  "start": "node server.js",  // ← Using single-pixel server
  "dev": "nodemon server.js"  // ← Using single-pixel server
}
```

## 🎯 Two Different Approaches

### Approach 1: Current Setup (What You're Using) ✅

**File:** `server.js` (single pixel server)

**How it works:**
- Each landing page's `index.html` has its own Pixel ID hardcoded
- CAPI server receives events and forwards to Meta
- You change Pixel ID **in each landing page's HTML file**

**To change Pixel:**
- Edit `sites/[ColorName]/index.html`
- Change lines 27 and 39 (as shown in HOW_TO_CHANGE_PIXEL_AND_CAPI.md)
- **DON'T touch `pixel-config.js`**

### Approach 2: Multi-Pixel Setup (Alternative)

**File:** `server-multi-pixel.js` (NOT currently active)

**How it works:**
- `pixel-config.js` maps landing page names to Pixel IDs
- CAPI server reads landing page name from request
- Server looks up correct Pixel ID from config
- Automatically uses correct pixel for each page

**To use this approach:**
- You would need to switch to `server-multi-pixel.js`
- Update `pixel-config.js` with all your pixels
- Landing pages send page name, server picks pixel

## 📊 Comparison

| Feature | Current (server.js) | Alternative (server-multi-pixel.js) |
|---------|---------------------|-------------------------------------|
| **Pixel ID Location** | In each landing page HTML | In pixel-config.js |
| **Easy to change one page** | ✅ Yes - edit one HTML file | ❌ Need to edit config + restart server |
| **Easy to change all pages** | ❌ Edit 16 HTML files | ✅ Edit one config file |
| **Server restart needed** | ❌ No | ✅ Yes (after config change) |
| **Currently active** | ✅ YES | ❌ NO |

## 🚦 When to Update pixel-config.js

### ❌ DON'T Update If:
- You're using the current setup (`server.js`)
- You want to change Pixel for one or a few pages
- You're happy with current approach
- Server is working fine

### ✅ DO Update If:
- You switch to `server-multi-pixel.js`
- You want centralized pixel management
- You frequently change pixels for all pages
- You're adding NEW landing pages not in the list

## 📝 How to Update pixel-config.js (If Needed)

### Current Landing Pages in Config:
- Black, Red, Blue, Green, Grey, Grey2.0
- Peach, Pink, Purple, Voilet, White, Yellow

### Your Actual Landing Pages:
- Blue, Coral, Cyan, Gold, Green, Grey, Grey2.0
- Indigo, Lime, Magenta, Navy, Neon, Orange, Peach, Pink, Teal

### Missing from Config:
- Coral, Cyan, Gold, Indigo, Lime, Magenta, Navy, Neon, Orange, Teal

### To Add Missing Pages:

```javascript
// Add to pixel-config.js

// Coral Landing Page
'Coral': {
  pixelId: 'YOUR_CORAL_PIXEL_ID',
  accessToken: 'YOUR_CORAL_ACCESS_TOKEN'
},

// Cyan Landing Page
'Cyan': {
  pixelId: 'YOUR_CYAN_PIXEL_ID',
  accessToken: 'YOUR_CYAN_ACCESS_TOKEN'
},

// Gold Landing Page
'Gold': {
  pixelId: 'YOUR_GOLD_PIXEL_ID',
  accessToken: 'YOUR_GOLD_ACCESS_TOKEN'
},

// Indigo Landing Page
'Indigo': {
  pixelId: 'YOUR_INDIGO_PIXEL_ID',
  accessToken: 'YOUR_INDIGO_ACCESS_TOKEN'
},

// Lime Landing Page
'Lime': {
  pixelId: 'YOUR_LIME_PIXEL_ID',
  accessToken: 'YOUR_LIME_ACCESS_TOKEN'
},

// Magenta Landing Page
'Magenta': {
  pixelId: 'YOUR_MAGENTA_PIXEL_ID',
  accessToken: 'YOUR_MAGENTA_ACCESS_TOKEN'
},

// Navy Landing Page
'Navy': {
  pixelId: 'YOUR_NAVY_PIXEL_ID',
  accessToken: 'YOUR_NAVY_ACCESS_TOKEN'
},

// Neon Landing Page
'Neon': {
  pixelId: 'YOUR_NEON_PIXEL_ID',
  accessToken: 'YOUR_NEON_ACCESS_TOKEN'
},

// Orange Landing Page
'Orange': {
  pixelId: 'YOUR_ORANGE_PIXEL_ID',
  accessToken: 'YOUR_ORANGE_ACCESS_TOKEN'
},

// Teal Landing Page
'Teal': {
  pixelId: 'YOUR_TEAL_PIXEL_ID',
  accessToken: 'YOUR_TEAL_ACCESS_TOKEN'
}
```

## 🔄 How to Switch to Multi-Pixel Server

If you want to use `pixel-config.js`:

### Step 1: Update pixel-config.js
Add all your landing pages with their Pixel IDs and Access Tokens.

### Step 2: Update package.json
```json
"scripts": {
  "start": "node server-multi-pixel.js",  // Change from server.js
  "dev": "nodemon server-multi-pixel.js"   // Change from server.js
}
```

### Step 3: Ensure Landing Pages Send Page Name
Check that `LANDING_PAGE_NAME` in each HTML matches the name in `pixel-config.js`:
- In HTML: `const LANDING_PAGE_NAME = 'Pink';`
- In config: `'Pink': { pixelId: '...' }`
- Names must match EXACTLY (case-sensitive)

### Step 4: Restart CAPI Server
```bash
cd capi-server
npm start
```

## ⚠️ Important Notes

### Access Tokens in pixel-config.js

Some entries have placeholder tokens:
```javascript
accessToken: 'YOUR_BLACK_ACCESS_TOKEN_HERE'  // ← Replace with real token
```

Real tokens look like:
```javascript
accessToken: 'EAARW0zbv2DMBQQ2Tc6FOVZBSAlEnswD8elztyZC6GYzk...' // ← Long string
```

**Get your Access Token from:**
- Facebook Events Manager → Settings → Conversions API → Generate Access Token

### Security Warning

⚠️ **NEVER commit `pixel-config.js` to public GitHub!**
- Contains sensitive Access Tokens
- Add to `.gitignore`
- Access tokens can be used to send events to your pixel
- Keep them secret!

## 🎯 Recommendation for Your Setup

**For NOW - Keep using `server.js`:**
- ✅ It's working
- ✅ Simple to understand
- ✅ Easy to change individual pages
- ✅ No server restart needed
- ✅ Each page is independent

**Change Pixels by editing HTML files** (see HOW_TO_CHANGE_PIXEL_AND_CAPI.md)

**Switch to `server-multi-pixel.js` later if:**
- You want centralized management
- You have many pages with same pixel
- You change pixels frequently for all pages

## 📋 Summary

### Current Situation:
- **Active Server:** `server.js` ✅
- **Config File:** `pixel-config.js` (NOT used)
- **Pixel Location:** Each landing page's HTML file

### What You Should Do:
1. **DON'T change `pixel-config.js`** (it's not being used)
2. **DO change Pixel IDs in landing page HTML files** (lines 27 & 39)
3. See **[HOW_TO_CHANGE_PIXEL_AND_CAPI.md](HOW_TO_CHANGE_PIXEL_AND_CAPI.md)** for instructions

### Only Update pixel-config.js If:
- You decide to switch to `server-multi-pixel.js`
- You want centralized pixel management
- You're adding support for new landing pages to the multi-pixel server

---

**Bottom Line:** With your current setup, you can safely **IGNORE `pixel-config.js`**. Just edit the HTML files directly! 🎉