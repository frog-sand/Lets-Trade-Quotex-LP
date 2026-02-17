# Multi-Pixel CAPI Setup Guide

This guide explains how to use different Facebook Pixels for different landing pages with server-side tracking (CAPI).

## 📋 Overview

Each landing page can have its own:
- Facebook Pixel ID
- Facebook Access Token
- Separate ad tracking

## 🔧 Setup Steps

### Step 1: Configure Pixels in `pixel-config.js`

Edit the `pixel-config.js` file in the root directory:

```javascript
const PIXEL_CONFIG = {
  'Black': {
    pixelId: 'YOUR_BLACK_PIXEL_ID',
    accessToken: 'YOUR_BLACK_ACCESS_TOKEN'
  },
  'Red': {
    pixelId: 'YOUR_RED_PIXEL_ID',
    accessToken: 'YOUR_RED_ACCESS_TOKEN'
  },
  // ... and so on for each landing page
};
```

### Step 2: Get Facebook Credentials

For EACH pixel you want to use:

1. Go to: https://business.facebook.com/events_manager2
2. Select your Pixel
3. Click **Settings** tab
4. Under **Conversions API**:
   - Copy your **Pixel ID**
   - Click **"Generate access token"**
   - Copy the **Access Token**
5. Add both to `pixel-config.js`

### Step 3: Update Each Landing Page

For each landing page (Black, Red, Blue, etc.):

1. **Update the Pixel ID** in the Facebook Pixel code (in `<head>`):
   ```javascript
   fbq('init', 'YOUR_PIXEL_ID_FOR_THIS_PAGE');
   ```

2. **Set the landing page name** (in the CAPI script at the bottom):
   ```javascript
   const CAPI_SERVER_URL = 'http://54.37.196.113:3000/api/track';
   const LANDING_PAGE_NAME = 'Black'; // Change to 'Red', 'Blue', etc.
   ```

3. **Add landingPage to the payload**:
   ```javascript
   const payload = {
     eventName: eventName,
     eventSourceUrl: window.location.href,
     userAgent: navigator.userAgent,
     fbp: fbp,
     fbc: fbc,
     landingPage: LANDING_PAGE_NAME, // ADD THIS LINE
   };
   ```

### Step 4: Deploy CAPI Server

1. SSH to your VPS:
   ```bash
   ssh root@54.37.196.113
   ```

2. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs
   ```

3. Create CAPI directory:
   ```bash
   mkdir -p /var/www/capi-server
   cd /var/www/capi-server
   ```

4. Upload your CAPI files (from local machine):
   ```bash
   # On Windows PowerShell
   scp -r "c:\Users\choud\Desktop\Landing PAGE\Lets-Trade-Quotex-LP\capi-server\*" root@54.37.196.113:/var/www/capi-server/
   scp "c:\Users\choud\Desktop\Landing PAGE\Lets-Trade-Quotex-LP\pixel-config.js" root@54.37.196.113:/var/www/capi-server/
   ```

5. Install dependencies and start (on VPS):
   ```bash
   cd /var/www/capi-server
   npm install
   node server-multi-pixel.js
   ```

### Step 5: Make CAPI Server Run Automatically

Create a systemd service (on VPS):

```bash
cat > /etc/systemd/system/capi-server.service << 'EOF'
[Unit]
Description=Meta CAPI Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/capi-server
ExecStart=/usr/bin/node server-multi-pixel.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl enable capi-server
systemctl start capi-server
systemctl status capi-server
```

### Step 6: Open Port 3000 (if needed)

If you have a firewall, allow port 3000:

```bash
ufw allow 3000/tcp
```

## 📝 Example Configuration

### Black Landing Page Example

**In `pixel-config.js`:**
```javascript
'Black': {
  pixelId: '111111111111111',
  accessToken: 'EAAGm7Ch4BO8BABc1pqxxx...'
},
```

**In `sites/Black/index.html` (head section):**
```javascript
fbq('init', '111111111111111'); // Must match pixel-config.js
```

**In `sites/Black/index.html` (CAPI script):**
```javascript
const CAPI_SERVER_URL = 'http://54.37.196.113:3000/api/track';
const LANDING_PAGE_NAME = 'Black';

const payload = {
  eventName: eventName,
  eventSourceUrl: window.location.href,
  userAgent: navigator.userAgent,
  fbp: fbp,
  fbc: fbc,
  landingPage: LANDING_PAGE_NAME, // Links to pixel-config.js
};
```

## ✅ How It Works

1. User visits **Black** landing page
2. Client-side Facebook Pixel fires (Pixel ID: 111111111111111)
3. CAPI code sends event to server with `landingPage: 'Black'`
4. CAPI server looks up 'Black' in `pixel-config.js`
5. Server sends event to Facebook using Black's pixel ID and access token

## 🎯 Benefits

- **Separate tracking** for each ad campaign
- **Different pixels** for A/B testing
- **Better data** - Client-side + Server-side tracking
- **Easy management** - All config in one file

## 🔍 Testing

After setup, check CAPI server logs:

```bash
journalctl -u capi-server -f
```

You should see:
```
[CAPI] Event sent for Black: PageView
[CAPI] Event sent for Red: Subscribe
```

## 🚨 Common Issues

**Issue**: "Access token not configured"
- **Solution**: Make sure access token doesn't contain `YOUR_` placeholder

**Issue**: "No pixel configuration found"
- **Solution**: Check `LANDING_PAGE_NAME` matches key in `pixel-config.js` exactly (case-sensitive)

**Issue**: CAPI server not starting
- **Solution**: Check if port 3000 is already in use: `netstat -tlnp | grep 3000`

---

## 📞 Need Help?

Check the CAPI server logs for errors:
```bash
journalctl -u capi-server -n 50
```
