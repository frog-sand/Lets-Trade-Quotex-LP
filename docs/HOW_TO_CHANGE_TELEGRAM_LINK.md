# 📱 How to Change Telegram Link on Landing Pages

## 📍 Quick Answer

**File to Edit:** `sites/[ColorName]/index.html` (NOT .backup.html)

**Number of Places:** **5 locations** in each landing page

**What to Change:** Replace `https://t.me/+YOUR_OLD_LINK` with `https://t.me/+YOUR_NEW_LINK`

---

## 🔍 Where Are Telegram Links?

Each landing page has **5 Telegram links** in different buttons/sections:

### Pink Landing Page Example:

| Location | Line | Button/Link |
|----------|------|-------------|
| **1. Sidebar Button** | ~756 | Arrow button in left sidebar |
| **2. Hero Primary CTA** | ~778 | "Get Started Free" button |
| **3. Hero Secondary CTA** | ~782 | "Join Community" button |
| **4. Final CTA Section** | ~902 | "Join Now - It's Free" button |
| **5. Footer Link** | ~928 | "Join Community" footer link |

### Grey Landing Page Example:

| Location | Line | Button/Link |
|----------|------|-------------|
| **1. Top Bar Button** | ~705 | "Get Started" top button |
| **2. Hero Primary CTA** | ~721 | "Start Trading Today" button |
| **3. Hero Secondary CTA** | ~725 | "Learn More" button |
| **4. Final CTA Section** | ~844 | Main CTA button |
| **5. Footer Link** | ~871 | "Join Community" footer link |

---

## 🎯 How to Change Telegram Link

### Method 1: Find & Replace (RECOMMENDED - Fastest Way)

This is the **easiest and fastest** method!

#### Step 1: Open the Landing Page File
```
sites/Pink/index.html  (or any color you want to change)
```

#### Step 2: Use Find & Replace
1. Press **Ctrl+H** (or **Cmd+H** on Mac)
2. **Find what:** `https://t.me/+beJaTDlk9o5mYWFl` (your OLD link)
3. **Replace with:** `https://t.me/+YOUR_NEW_LINK` (your NEW link)
4. Click **Replace All**
5. Save the file

**Done!** All 5 links changed at once! ✅

---

### Method 2: Manual Edit (Change Each Link)

If you prefer to change them one by one:

#### Pink Landing Page - All 5 Locations:

**Location 1 - Sidebar Button (Line ~756):**
```html
<a href="https://t.me/+beJaTDlk9o5mYWFl" class="social-icon" onclick="handleCTAClick(event);">→</a>
```
**Change to:**
```html
<a href="https://t.me/+YOUR_NEW_LINK" class="social-icon" onclick="handleCTAClick(event);">→</a>
```

**Location 2 - Hero "Get Started Free" Button (Line ~778):**
```html
<a href="https://t.me/+beJaTDlk9o5mYWFl" class="cta-btn cta-btn-primary" onclick="handleCTAClick(event);">
```
**Change to:**
```html
<a href="https://t.me/+YOUR_NEW_LINK" class="cta-btn cta-btn-primary" onclick="handleCTAClick(event);">
```

**Location 3 - Hero "Join Community" Button (Line ~782):**
```html
<a href="https://t.me/+beJaTDlk9o5mYWFl" class="cta-btn cta-btn-secondary" onclick="handleCTAClick(event);">
```
**Change to:**
```html
<a href="https://t.me/+YOUR_NEW_LINK" class="cta-btn cta-btn-secondary" onclick="handleCTAClick(event);">
```

**Location 4 - Final CTA "Join Now" Button (Line ~902):**
```html
<a href="https://t.me/+beJaTDlk9o5mYWFl" class="cta-btn cta-btn-primary" onclick="handleCTAClick(event);">
```
**Change to:**
```html
<a href="https://t.me/+YOUR_NEW_LINK" class="cta-btn cta-btn-primary" onclick="handleCTAClick(event);">
```

**Location 5 - Footer Link (Line ~928):**
```html
<a href="https://t.me/+beJaTDlk9o5mYWFl">Join Community</a>
```
**Change to:**
```html
<a href="https://t.me/+YOUR_NEW_LINK">Join Community</a>
```

---

## 📋 Step-by-Step Guide

### Example: Changing Pink Landing Page Telegram Link

**Current Link:** `https://t.me/+beJaTDlk9o5mYWFl`
**New Link:** `https://t.me/+MyNewGroup123456`

#### Step 1: Open File
```
sites/Pink/index.html
```

#### Step 2: Find & Replace
- **Find:** `https://t.me/+beJaTDlk9o5mYWFl`
- **Replace:** `https://t.me/+MyNewGroup123456`
- **Click:** Replace All

#### Step 3: Save
Press Ctrl+S (or Cmd+S on Mac)

#### Step 4: Test
1. Open your Pink landing page in browser
2. Click any button ("Get Started Free", etc.)
3. Should redirect to your new Telegram group
4. ✅ Done!

---

## 🎨 Different Links for Different Pages

You can use **different Telegram links** for different landing pages to track which page brings users:

### Example Strategy:

```
Pink Page   → https://t.me/+PinkCampaign2024
Grey Page   → https://t.me/+GreyCampaign2024
Blue Page   → https://t.me/+BlueCampaign2024
All Others  → https://t.me/+MainGroup123456
```

### How to Set This Up:

**For Pink page:**
```bash
# Edit sites/Pink/index.html
Find: old link
Replace: https://t.me/+PinkCampaign2024
```

**For Grey page:**
```bash
# Edit sites/Grey/index.html
Find: old link
Replace: https://t.me/+GreyCampaign2024
```

**Benefit:** You'll know which landing page each user came from!

---

## 📂 File Structure Reference

```
sites/
├── Pink/
│   ├── index.html         ← Edit this (5 Telegram links inside)
│   └── index.backup.html  ← Don't edit (backup only)
├── Grey/
│   ├── index.html         ← Edit this (5 Telegram links inside)
│   └── index.backup.html  ← Don't edit (backup only)
├── Blue/
│   ├── index.html         ← Edit this (5 Telegram links inside)
│   └── index.backup.html  ← Don't edit (backup only)
... (and so on for all 16 pages)
```

---

## ⚠️ Important Notes

### 1. Edit Only `index.html`, NOT `.backup.html`
- ✅ Edit: `sites/Pink/index.html`
- ❌ Don't edit: `sites/Pink/index.backup.html`

### 2. Change ALL 5 Links
Make sure you change all 5 occurrences in each page. Missing one means that button won't work!

### 3. Telegram Link Format
Your Telegram link should look like:
- ✅ `https://t.me/+YOUR_INVITE_CODE`
- ✅ `https://t.me/your_group_name`
- ❌ Not: `t.me/...` (missing https://)
- ❌ Not: `telegram.me/...` (use t.me)

### 4. Test After Changing
Always test by:
1. Opening the landing page
2. Clicking different buttons
3. Verifying they all go to the correct Telegram group

---

## 🔍 How to Find Telegram Links in File

### Method 1: Search for t.me
1. Open `index.html` in code editor
2. Press **Ctrl+F** (or **Cmd+F** on Mac)
3. Search for: `t.me`
4. You'll see all 5 locations highlighted

### Method 2: Search for href
Search for: `href="https://t.me`
This will find all Telegram links specifically.

---

## 📊 Quick Reference Table

### Pink Landing Page Links:

| # | Line | Element | Purpose |
|---|------|---------|---------|
| 1 | ~756 | Sidebar arrow icon | Quick access button |
| 2 | ~778 | "Get Started Free" | Main hero CTA |
| 3 | ~782 | "Join Community" | Secondary hero CTA |
| 4 | ~902 | "Join Now - It's Free" | Final CTA section |
| 5 | ~928 | Footer link | Bottom page link |

### Grey Landing Page Links:

| # | Line | Element | Purpose |
|---|------|---------|---------|
| 1 | ~705 | "Get Started" top button | Top bar CTA |
| 2 | ~721 | "Start Trading Today" | Main hero CTA |
| 3 | ~725 | "Learn More" | Secondary hero CTA |
| 4 | ~844 | Final CTA button | Final CTA section |
| 5 | ~871 | Footer link | Bottom page link |

**Note:** All other landing pages have similar 5 locations.

---

## ✅ Complete Checklist

When changing Telegram link for a landing page:

- [ ] Open correct file: `sites/[ColorName]/index.html`
- [ ] Use Find & Replace for OLD link
- [ ] Replace with NEW link
- [ ] Verify all 5 occurrences changed
- [ ] Save the file
- [ ] DON'T edit `.backup.html` file
- [ ] Test in browser - click all buttons
- [ ] Verify redirect to correct Telegram group
- [ ] Repeat for other landing pages if needed

---

## 🚀 Automation Script (Optional)

If you want to change Telegram links on ALL pages at once, I can create a script for you. Just let me know!

**Example use case:**
- You want to change ALL 16 landing pages to same new Telegram link
- Instead of editing 16 files manually
- Script does it in seconds

---

## 📝 Real Example

### Scenario: You want to change Pink page Telegram link

**Current link in Pink page:**
```
https://t.me/+beJaTDlk9o5mYWFl
```

**Your new Telegram group:**
```
https://t.me/+NewQuotexGroup2024
```

### Steps:
1. Open: `sites/Pink/index.html`
2. Press: **Ctrl+H**
3. Find: `https://t.me/+beJaTDlk9o5mYWFl`
4. Replace: `https://t.me/+NewQuotexGroup2024`
5. Click: **Replace All** (should say "5 occurrences replaced")
6. Save: **Ctrl+S**
7. Test: Open page and click buttons

**Done! Takes less than 30 seconds!** ✅

---

## 🎯 Summary

### Quick Facts:
- **File to edit:** `sites/[ColorName]/index.html`
- **Number of links per page:** 5
- **Best method:** Find & Replace (Ctrl+H)
- **Time needed:** 30 seconds per page
- **Don't edit:** `.backup.html` files

### To Change Link:
1. Open `index.html`
2. Find & Replace old Telegram link with new one
3. Save
4. Test
5. Done!

**Need help? Just ask!** 🚀