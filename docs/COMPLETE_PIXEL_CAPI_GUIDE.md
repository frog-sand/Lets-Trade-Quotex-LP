# 🎯 Complete Guide: Pixel, CAPI, and Your Setup

## 📋 Your Questions Answered

### ❓ Question 1: Do I need to edit pixel-config.js for CAPI?

**Answer: NO, you don't need to edit pixel-config.js**

Here's why:

#### Your Current CAPI Setup:
```
Landing Page HTML → Sends event to CAPI Server → CAPI forwards to Facebook
                    (includes Pixel ID from HTML)
```

**How it works:**
1. Your landing page (Pink, Grey, etc.) loads
2. JavaScript in HTML sends event to: `https://letstradequotex.com/api/track`
3. CAPI server receives: event data + landing page info
4. CAPI server uses Facebook Pixel from the browser event
5. Server forwards to Facebook CAPI

**What you need to change for CAPI:**
- ✅ Just the CAPI server URL in HTML (Line ~938)
- ❌ NOT pixel-config.js

---

## 🔄 What is "server-multi-pixel.js"?

Let me explain with a simple comparison:

### Current Setup (server.js) - What You're Using ✅

**Scenario:**
- Pink page uses Pixel A
- Grey page uses Pixel B
- Blue page uses Pixel A (same as Pink)

**How it works with `server.js`:**
```
Pink/index.html:
  - Line 27: fbq('init', 'PIXEL_A')
  - Line 938: CAPI_SERVER_URL = 'https://letstradequotex.com/api/track'
  - Sends to CAPI server → Server forwards to Facebook with PIXEL_A

Grey/index.html:
  - Line 27: fbq('init', 'PIXEL_B')
  - Line 938: CAPI_SERVER_URL = 'https://letstradequotex.com/api/track'
  - Sends to CAPI server → Server forwards to Facebook with PIXEL_B

Blue/index.html:
  - Line 27: fbq('init', 'PIXEL_A')  (same as Pink)
  - Line 938: CAPI_SERVER_URL = 'https://letstradequotex.com/api/track'
  - Sends to CAPI server → Server forwards to Facebook with PIXEL_A
```

**Each page has its own Pixel ID in the HTML file.**

### Alternative Setup (server-multi-pixel.js) - NOT Active ❌

**How it would work with `server-multi-pixel.js`:**

**pixel-config.js:**
```javascript
{
  'Pink': { pixelId: 'PIXEL_A', accessToken: 'TOKEN_A' },
  'Grey': { pixelId: 'PIXEL_B', accessToken: 'TOKEN_B' },
  'Blue': { pixelId: 'PIXEL_A', accessToken: 'TOKEN_A' }
}
```

**Landing pages:**
```
Pink/index.html:
  - Sends landing page name: 'Pink'
  - CAPI server looks up 'Pink' in pixel-config.js
  - Finds PIXEL_A → Uses that for CAPI

Grey/index.html:
  - Sends landing page name: 'Grey'
  - CAPI server looks up 'Grey' in pixel-config.js
  - Finds PIXEL_B → Uses that for CAPI
```

**The CAPI server decides which Pixel to use based on page name.**

---

## 🎯 Your Use Case: 1 Pixel for Multiple Pages

You said:
> "I use 1 same pixel for 2-3 landing pages and some with 1 pixel each"

**Example:**
- Pixel A: Used by Pink, Blue, Coral
- Pixel B: Used by Grey only
- Pixel C: Used by Green, Lime
- Pixel D: Used by Navy only

### With Current Setup (server.js) ✅ RECOMMENDED

**What you do:**
```
Pink/index.html   → Line 27: fbq('init', 'PIXEL_A')
Blue/index.html   → Line 27: fbq('init', 'PIXEL_A')  (same as Pink)
Coral/index.html  → Line 27: fbq('init', 'PIXEL_A')  (same as Pink)

Grey/index.html   → Line 27: fbq('init', 'PIXEL_B')  (different)

Green/index.html  → Line 27: fbq('init', 'PIXEL_C')
Lime/index.html   → Line 27: fbq('init', 'PIXEL_C')  (same as Green)

Navy/index.html   → Line 27: fbq('init', 'PIXEL_D')  (different)
```

**Advantages:**
- ✅ Clear - you see each page's pixel in its own file
- ✅ Independent - changing one page doesn't affect others
- ✅ No server restart needed
- ✅ Simple to understand

**Disadvantages:**
- ❌ If you want to change PIXEL_A on all 3 pages, you edit 3 files

### With Multi-Pixel Setup (server-multi-pixel.js) ❌ Alternative

**pixel-config.js:**
```javascript
{
  'Pink': { pixelId: 'PIXEL_A', accessToken: 'TOKEN_A' },
  'Blue': { pixelId: 'PIXEL_A', accessToken: 'TOKEN_A' },
  'Coral': { pixelId: 'PIXEL_A', accessToken: 'TOKEN_A' },
  'Grey': { pixelId: 'PIXEL_B', accessToken: 'TOKEN_B' },
  'Green': { pixelId: 'PIXEL_C', accessToken: 'TOKEN_C' },
  'Lime': { pixelId: 'PIXEL_C', accessToken: 'TOKEN_C' },
  'Navy': { pixelId: 'PIXEL_D', accessToken: 'TOKEN_D' }
}
```

**Advantages:**
- ✅ Change PIXEL_A once in config → affects all 3 pages
- ✅ Centralized management

**Disadvantages:**
- ❌ Need to restart CAPI server after changes
- ❌ All pages must be in config file
- ❌ More complex setup

---

## 💡 Recommendation for Your Situation

**KEEP using `server.js` (current setup)**

Why?
1. You already have it working ✅
2. Some pages share pixels, some don't → current setup handles this fine
3. Easy to see which page uses which pixel
4. No server restart needed when changing pixels
5. Each page is independent

**When to change a Pixel:**
- Just edit that page's `index.html` (Lines 27 & 39)
- If 3 pages share same pixel, edit all 3 HTML files
- Done! No server restart needed

---

## 📁 Backup Files (.backup.html) - What Are They?

### What Are Backup Files?

When you ran the optimization scripts (`optimize-all-pages.js`, `remove-all-animations.js`), they automatically created backup files:

```
sites/Pink/index.html         ← Current (optimized) version
sites/Pink/index.backup.html  ← Original (before optimization)
```

### Why They Exist:

**Safety net!** If optimization broke something, you can restore the original:

```bash
# Restore Pink page to original
cd sites/Pink
copy index.backup.html index.html
```

### Do You Need to Change Backup Files?

**NO! Never edit .backup.html files**

Here's why:

| File | Purpose | Do You Edit? |
|------|---------|--------------|
| `index.html` | **Active page** users see | ✅ YES - edit this |
| `index.backup.html` | **Safety copy** of original | ❌ NO - don't touch |

**When changing Pixel/CAPI:**
- ✅ Edit `index.html` only
- ❌ Don't edit `index.backup.html`
- 🗑️ You can delete `.backup.html` files if you want (once you verify optimized version works)

### What Backup Files Contain:

The backup files have:
- ❌ OLD code (before optimization)
- ❌ Blocking CAPI calls (slow)
- ❌ All animations (slow)
- ❌ opacity: 0 issues

The current `index.html` files have:
- ✅ NEW optimized code
- ✅ Non-blocking CAPI (fast)
- ✅ No animations (fast)
- ✅ Everything visible

**Always edit `index.html`, not `index.backup.html`**

---

## 🎯 Complete Checklist: Changing Pixel & CAPI

### To Change Facebook Pixel for a Landing Page:

**Example: Change Pink landing page Pixel**

1. **Open:** `sites/Pink/index.html` (NOT .backup.html)

2. **Find Line ~27:**
   ```javascript
   fbq('init', '1498315231226863');
   ```
   **Change to:**
   ```javascript
   fbq('init', 'YOUR_NEW_PIXEL_ID');
   ```

3. **Find Line ~39:**
   ```html
   <img src="https://www.facebook.com/tr?id=1498315231226863&ev=PageView&noscript=1"/>
   ```
   **Change to:**
   ```html
   <img src="https://www.facebook.com/tr?id=YOUR_NEW_PIXEL_ID&ev=PageView&noscript=1"/>
   ```

4. **Save** the file

5. **Test:** Open page, check Facebook Events Manager

6. **DON'T edit:**
   - ❌ `index.backup.html`
   - ❌ `pixel-config.js`

### To Change CAPI Server URL:

**Example: Change CAPI server for Pink page**

1. **Open:** `sites/Pink/index.html`

2. **Find Line ~938:**
   ```javascript
   const CAPI_SERVER_URL = 'https://letstradequotex.com/api/track';
   ```
   **Change to:**
   ```javascript
   const CAPI_SERVER_URL = 'https://YOUR-NEW-SERVER.com/api/track';
   ```

3. **Optional - Change page name (Line ~939):**
   ```javascript
   const LANDING_PAGE_NAME = 'Pink2.0';
   ```

4. **Save** the file

5. **Test:** Check CAPI server logs

---

## 📊 Summary Table

| What | File to Edit | Line Number | Edit Backup File? |
|------|--------------|-------------|-------------------|
| **Facebook Pixel ID #1** | `index.html` | ~27 | ❌ NO |
| **Facebook Pixel ID #2** | `index.html` | ~39 | ❌ NO |
| **CAPI Server URL** | `index.html` | ~938 | ❌ NO |
| **Landing Page Name** | `index.html` | ~939 | ❌ NO |
| **CAPI Pixel Mapping** | `pixel-config.js` | N/A | ❌ NOT USED |

---

## 🔍 Quick Reference

### Your Current Setup:
```
Server: server.js (single pixel mode)
Config: pixel-config.js (NOT USED)
Pixels: In each landing page's index.html
Backup: index.backup.html (safety copy - don't edit)
```

### To Change Pixels:
1. ✅ Edit `sites/[ColorName]/index.html`
2. ✅ Change lines 27 & 39
3. ❌ Don't edit `index.backup.html`
4. ❌ Don't edit `pixel-config.js`

### To Change CAPI:
1. ✅ Edit `sites/[ColorName]/index.html`
2. ✅ Change line ~938
3. ❌ Don't edit `index.backup.html`
4. ❌ Don't edit `pixel-config.js`

---

## 🎓 Example: Real World Scenario

**You have:**
- 16 landing pages
- 3 different Pixel IDs (A, B, C)
- Pink, Blue, Coral use Pixel A
- Grey, Navy use Pixel B
- All others use Pixel C

**What you need to do:**

### Step 1: Update Pink, Blue, Coral with Pixel A
```bash
# Edit each file:
sites/Pink/index.html   → Lines 27 & 39: Set to PIXEL_A
sites/Blue/index.html   → Lines 27 & 39: Set to PIXEL_A
sites/Coral/index.html  → Lines 27 & 39: Set to PIXEL_A
```

### Step 2: Update Grey, Navy with Pixel B
```bash
sites/Grey/index.html   → Lines 27 & 39: Set to PIXEL_B
sites/Navy/index.html   → Lines 27 & 39: Set to PIXEL_B
```

### Step 3: Update all others with Pixel C
```bash
sites/Cyan/index.html → Lines 27 & 39: Set to PIXEL_C
sites/Gold/index.html → Lines 27 & 39: Set to PIXEL_C
... (repeat for remaining pages)
```

### Step 4: Don't touch these files:
- ❌ All `index.backup.html` files
- ❌ `pixel-config.js`
- ❌ CAPI server files

---

## ✅ Final Answers to Your Questions

### 1. Do I need to edit pixel-config.js for CAPI?
**NO.** Your current setup doesn't use it.

### 2. What is server-multi-pixel.js?
**An alternative CAPI server** that reads Pixel IDs from `pixel-config.js` instead of from HTML. You're NOT using it.

### 3. I use 1 pixel for 2-3 pages - is that okay?
**YES, perfectly fine!** Just put the same Pixel ID in all those pages' HTML files (lines 27 & 39).

### 4. What are .backup.html files for?
**Safety copies** created by optimization scripts. Don't edit them. You can delete them once you verify everything works.

### 5. Should I change backup files when changing Pixel/CAPI?
**NO.** Only edit `index.html`, never `index.backup.html`.

---

**Need help with a specific change? Just ask!** 🚀