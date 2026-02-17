# Complete Guide: Connect Domain & Host Your Project

## 🎯 What You'll Achieve
- Your domain `letstradequotex.com` will show your landing pages
- Each folder in `sites/` becomes a page: `letstradequotex.com/Black/`
- Push to GitHub = Auto-deploy to live site
- HTTPS (secure) enabled

---

## 📋 Your Details
- **Domain**: letstradequotex.com (owned on Qhoster)
- **VPS IP**: 54.37.196.113
- **VPS Hostname**: 41586038.securefastserver.com
- **GitHub Repo**: https://github.com/frog-sand/Lets-Trade-Quotex-LP

---

# PART 1: CONNECT TO YOUR VPS (Choose One Method)

## Method 1: VNC Console (EASIEST - RECOMMENDED!)

### Step 1.1: Login to Qhoster
1. Go to: https://client.qhoster.com/
2. Login with your Qhoster account
3. Click "Services" → "My Services"
4. Click on "Linux KVM VPS 1"

### Step 1.2: Open VNC Console
1. Look for the **"VNC"** button
2. Click it
3. A new window/tab opens with a black console screen
4. **You're now connected to your server!** ✅

---

## Method 2: SSH (If you know your password)

### Step 2.1: Open Command Prompt (Windows)
1. Press `Windows Key + R`
2. Type: `cmd`
3. Press Enter

### Step 2.2: Connect via SSH
```bash
ssh root@54.37.196.113
```

When asked for password, enter your root password (check your Qhoster welcome email)

**Note**: You won't see the password as you type - this is normal. Just type and press Enter.

---

# PART 2: SETUP YOUR VPS SERVER

**Important**: Copy and paste these commands one section at a time. Wait for each section to complete before moving to the next.

## Step 2.1: Update System and Install Required Software

Copy and paste this:
```bash
apt update && apt upgrade -y
```

Wait for it to complete (may take 2-5 minutes), then:

```bash
apt install -y nginx git rsync curl
```

**What this does**: Installs Nginx (web server), Git (for GitHub), and other tools.

---

## Step 2.2: Create Web Directory

Copy and paste:
```bash
mkdir -p /var/www/letstradequotex.com
chown -R www-data:www-data /var/www/letstradequotex.com
chmod -R 755 /var/www/letstradequotex.com
mkdir -p /etc/nginx/snippets
```

**What this does**: Creates the folder where your website files will be stored.

---

## Step 2.3: Generate SSH Key for GitHub

Copy and paste:
```bash
ssh-keygen -t ed25519 -C "deploy@letstradequotex.com" -f /root/.ssh/id_ed25519 -N ""
```

**What this does**: Creates a key so your server can download from GitHub.

---

## Step 2.4: Display the Public Key

Copy and paste:
```bash
echo "==========================================="
echo "COPY THE KEY BELOW (including ssh-ed25519):"
echo "==========================================="
cat /root/.ssh/id_ed25519.pub
echo "==========================================="
```

**You'll see something like:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJqd... deploy@letstradequotex.com
```

**SELECT AND COPY THIS ENTIRE LINE** (right-click in VNC or Ctrl+Shift+C in terminal)

---

# PART 3: ADD DEPLOY KEY TO GITHUB

## Step 3.1: Go to GitHub Deploy Keys Page
1. Open browser and go to: https://github.com/frog-sand/Lets-Trade-Quotex-LP/settings/keys
2. Click the green **"Add deploy key"** button

## Step 3.2: Add the Key
1. **Title**: Type `Qhoster VPS Deploy Key`
2. **Key**: Paste the key you copied from Step 2.4
3. Click **"Add key"**

You should see your key added to the list ✅

---

# PART 4: TEST GITHUB CONNECTION

Back in your VPS terminal (VNC or SSH), run:

```bash
ssh -T git@github.com
```

**First time?** You'll see:
```
The authenticity of host 'github.com' can't be established.
Are you sure you want to continue connecting (yes/no)?
```

**Type**: `yes` and press Enter

**You should see:**
```
Hi frog-sand/Lets-Trade-Quotex-LP! You've successfully authenticated, but GitHub does not provide shell access.
```

✅ **Success!** Your server can now access GitHub.

---

# PART 5: CREATE DEPLOYMENT SCRIPT

Copy and paste this ENTIRE block (it's long, but copy it all):

```bash
cat > /root/deploy-ltq.sh << 'DEPLOY_SCRIPT'
#!/bin/bash

set -e

REPO_DIR="/tmp/html-sites-deploy"
SITES_DIR="/var/www/letstradequotex.com"

echo "🚀 Starting deployment..."

# Clean up previous deployment
rm -rf $REPO_DIR

# Clone the repository
git clone git@github.com:frog-sand/Lets-Trade-Quotex-LP.git $REPO_DIR

# Copy sites to web directory
mkdir -p $SITES_DIR
rsync -av --delete $REPO_DIR/sites/ $SITES_DIR/
chown -R www-data:www-data $SITES_DIR
chmod -R 755 $SITES_DIR

# Generate nginx config snippet
bash $REPO_DIR/scripts/generate-nginx-config.sh

# Copy main nginx config
cp $REPO_DIR/nginx-config/letstradequotex.com.conf /etc/nginx/sites-available/letstradequotex.com

# Enable site
if [ ! -L /etc/nginx/sites-enabled/letstradequotex.com ]; then
    ln -s /etc/nginx/sites-available/letstradequotex.com /etc/nginx/sites-enabled/letstradequotex.com
fi

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Deployed landing pages:"
for site in $SITES_DIR/*/; do
    if [ -d "$site" ]; then
        sitename=$(basename "$site")
        echo "   ✓ http://54.37.196.113/$sitename/"
    fi
done
DEPLOY_SCRIPT
```

Now make it executable:
```bash
chmod +x /root/deploy-ltq.sh
```

**What this does**: Creates a script that will deploy your website from GitHub.

---

# PART 6: RUN FIRST DEPLOYMENT

```bash
/root/deploy-ltq.sh
```

**This will**:
1. Download your code from GitHub
2. Copy all landing pages to the web server
3. Configure Nginx
4. Start serving your website

**You should see**:
```
✅ Deployment completed successfully!

📋 Deployed landing pages:
   ✓ http://54.37.196.113/Black/
   ✓ http://54.37.196.113/Blue/
   ✓ http://54.37.196.113/Green/
   ...
```

---

# PART 7: TEST YOUR WEBSITE WITH IP

Open your browser and visit:
- http://54.37.196.113/Black/
- http://54.37.196.113/Blue/
- http://54.37.196.113/Green/

**If you see your landing pages** ✅ **SUCCESS!** Your site is working!

**If you see an error**, check:
```bash
systemctl status nginx
tail -f /var/log/nginx/error.log
```

---

# PART 8: CONNECT YOUR DOMAIN

## Step 8.1: Login to Qhoster DNS Management
1. Go to: https://client.qhoster.com/
2. Click "Domains" → "My Domains"
3. Find "letstradequotex.com"
4. Click "Manage Domain" or "DNS Management"

## Step 8.2: Update DNS Records

You need to add/update these records:

### Record 1: Main Domain
- **Type**: A
- **Name**: `@` (or leave blank or type `letstradequotex.com`)
- **Value/Points to**: `54.37.196.113`
- **TTL**: `3600` (or 1 hour)

### Record 2: WWW Subdomain
- **Type**: A
- **Name**: `www`
- **Value/Points to**: `54.37.196.113`
- **TTL**: `3600`

**Delete any old A records** pointing to different IPs.

## Step 8.3: Save Changes

Click "Save" or "Update" button.

## Step 8.4: Wait for DNS Propagation

**Time needed**: 10 minutes to 2 hours (usually 10-30 minutes)

**Check DNS propagation**:
1. Go to: https://dnschecker.org/
2. Enter: `letstradequotex.com`
3. Select "A" record type
4. Click "Search"
5. Wait until most locations show: `54.37.196.113`

---

# PART 9: TEST WITH YOUR DOMAIN

After DNS has propagated, visit:
- http://letstradequotex.com/Black/
- http://letstradequotex.com/Blue/
- http://www.letstradequotex.com/Green/

**Working?** ✅ **Awesome!** Let's add HTTPS (secure connection).

---

# PART 10: ADD SSL CERTIFICATE (HTTPS)

Back in your VPS terminal:

## Step 10.1: Install Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

## Step 10.2: Get SSL Certificate
```bash
certbot --nginx -d letstradequotex.com -d www.letstradequotex.com
```

**Follow the prompts:**

1. **Enter email address**: Type your email and press Enter
2. **Agree to Terms**: Type `Y` and press Enter
3. **Share email with EFF**: Type `N` and press Enter (optional)
4. **Redirect HTTP to HTTPS**: Type `2` and press Enter

**You should see:**
```
Congratulations! Your certificate has been saved...
```

✅ **SSL Installed!**

---

# PART 11: TEST HTTPS

Visit:
- https://letstradequotex.com/Black/
- https://letstradequotex.com/Blue/

**You should see a padlock 🔒 in the browser!**

---

# PART 12: SETUP AUTO-DEPLOYMENT (GitHub Actions)

## Step 12.1: Get SSH Private Key from Server

In your VPS terminal:
```bash
cat /root/.ssh/id_ed25519
```

**You'll see something like:**
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCand7...
...many more lines...
-----END OPENSSH PRIVATE KEY-----
```

**COPY EVERYTHING** including the BEGIN and END lines.

## Step 12.2: Add GitHub Secrets

1. Go to: https://github.com/frog-sand/Lets-Trade-Quotex-LP/settings/secrets/actions
2. Click **"New repository secret"**

Add these 4 secrets (one by one):

### Secret 1:
- **Name**: `SERVER_HOST`
- **Value**: `54.37.196.113`
- Click "Add secret"

### Secret 2:
- **Name**: `SERVER_USER`
- **Value**: `root`
- Click "Add secret"

### Secret 3:
- **Name**: `SSH_PRIVATE_KEY`
- **Value**: Paste the entire private key you copied
- Click "Add secret"

### Secret 4:
- **Name**: `SERVER_PORT`
- **Value**: `22`
- Click "Add secret"

---

# PART 13: TEST AUTO-DEPLOYMENT

## Step 13.1: Make a Test Change

On your **local computer** (Windows):

1. Open Command Prompt:
   - Press `Windows Key + R`
   - Type: `cmd`
   - Press Enter

2. Navigate to your project:
   ```bash
   cd "c:\Users\choud\Desktop\Landing PAGE\Lets-Trade-Quotex-LP"
   ```

3. Create an empty commit to trigger deployment:
   ```bash
   git commit --allow-empty -m "Test auto-deployment"
   git push
   ```

## Step 13.2: Watch GitHub Actions

1. Go to: https://github.com/frog-sand/Lets-Trade-Quotex-LP/actions
2. You should see a workflow running (yellow circle)
3. Click on it to see progress
4. Wait for green checkmark ✅ (takes about 30-60 seconds)

## Step 13.3: Verify Deployment

If you see green checkmark, visit:
- https://letstradequotex.com/Black/

**Working?** ✅ **PERFECT!** Auto-deployment is working!

---

# 🎉 YOU'RE DONE! COMPLETE SETUP!

## ✅ What You Now Have:

- ✅ VPS server configured
- ✅ Nginx web server running
- ✅ Domain connected: letstradequotex.com
- ✅ HTTPS/SSL enabled (secure)
- ✅ Auto-deployment from GitHub
- ✅ All landing pages live

---

# 🚀 HOW TO ADD NEW LANDING PAGES NOW

## Super Simple 3-Step Process:

### Step 1: Create New Folder
On your local computer, create a new folder in `sites/`:

```bash
cd "c:\Users\choud\Desktop\Landing PAGE\Lets-Trade-Quotex-LP"
mkdir sites\MyNewLanding
```

### Step 2: Add Your HTML File
Create `index.html` in that folder:
- Copy your landing page HTML file
- Rename it to `index.html`
- Put it in `sites\MyNewLanding\index.html`

### Step 3: Commit and Push
```bash
git add sites\MyNewLanding
git commit -m "Add MyNewLanding page"
git push
```

### Step 4: Wait 30 Seconds
GitHub Actions will automatically deploy to your server!

### Step 5: Visit Your New Page
https://letstradequotex.com/MyNewLanding/

**That's it!** 🎉

---

# 🔧 USEFUL COMMANDS

## On Your Server (VPS):

```bash
# Manual deployment (if needed)
/root/deploy-ltq.sh

# Check if nginx is running
systemctl status nginx

# Restart nginx
systemctl restart nginx

# View nginx error logs
tail -f /var/log/nginx/letstradequotex.com-error.log

# View deployed sites
ls -la /var/www/letstradequotex.com/

# Check SSL certificate status
certbot certificates
```

## On Your Local Computer:

```bash
# Navigate to project
cd "c:\Users\choud\Desktop\Landing PAGE\Lets-Trade-Quotex-LP"

# See what changed
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub (triggers auto-deploy)
git push

# View GitHub Actions
# Visit: https://github.com/frog-sand/Lets-Trade-Quotex-LP/actions
```

---

# 🆘 TROUBLESHOOTING

## Problem: Can't connect to VPS
**Solution**: Use VNC console instead of SSH
1. Qhoster panel → Your VPS → Click "VNC"

## Problem: Domain not loading
**Solution**: Check DNS propagation
1. Visit: https://dnschecker.org/
2. Enter your domain
3. Wait longer if not propagated (can take up to 48 hours)
4. Meanwhile, use IP: http://54.37.196.113/Black/

## Problem: GitHub Actions failing
**Solution**: Check GitHub secrets
1. Go to: https://github.com/frog-sand/Lets-Trade-Quotex-LP/settings/secrets/actions
2. Verify all 4 secrets are added correctly
3. Check Actions logs for specific error

## Problem: 502 Bad Gateway
**Solution**: Restart nginx
```bash
ssh root@54.37.196.113
systemctl restart nginx
```

## Problem: SSL certificate expired
**Solution**: Renew certificate
```bash
certbot renew
```

## Problem: Site shows old content
**Solution**: Clear browser cache or:
```bash
ssh root@54.37.196.113
/root/deploy-ltq.sh
```

---

# 📁 YOUR PROJECT STRUCTURE

```
Lets-Trade-Quotex-LP/
├── sites/                    ← Your landing pages
│   ├── Black/
│   │   ├── index.html       ← Each folder needs index.html
│   │   └── LP11.JPEG
│   ├── Blue/
│   │   └── index.html
│   ├── Green/
│   │   └── index.html
│   └── NewLanding/          ← Just add new folders here!
│       └── index.html
│
├── scripts/
│   ├── deploy.sh            ← Deployment script
│   └── generate-nginx-config.sh
│
├── nginx-config/
│   └── letstradequotex.com.conf  ← Nginx configuration
│
└── .github/
    └── workflows/
        └── deploy.yml       ← Auto-deployment config
```

---

# 📊 QUICK REFERENCE

| Item | Value |
|------|-------|
| **Domain** | letstradequotex.com |
| **VPS IP** | 54.37.196.113 |
| **SSH Command** | `ssh root@54.37.196.113` |
| **Deploy Script** | `/root/deploy-ltq.sh` |
| **Web Directory** | `/var/www/letstradequotex.com/` |
| **GitHub Repo** | https://github.com/frog-sand/Lets-Trade-Quotex-LP |
| **GitHub Actions** | https://github.com/frog-sand/Lets-Trade-Quotex-LP/actions |
| **GitHub Secrets** | https://github.com/frog-sand/Lets-Trade-Quotex-LP/settings/secrets/actions |
| **DNS Check** | https://dnschecker.org/ |

---

# ✅ FINAL CHECKLIST

Check off each item as you complete it:

- [ ] Connected to VPS (VNC or SSH)
- [ ] Installed Nginx and Git
- [ ] Created web directory
- [ ] Generated SSH key
- [ ] Added deploy key to GitHub
- [ ] Tested GitHub connection
- [ ] Created deployment script
- [ ] Ran first deployment
- [ ] Tested site with IP address
- [ ] Updated DNS records
- [ ] Waited for DNS propagation
- [ ] Tested site with domain name
- [ ] Installed SSL certificate
- [ ] Tested HTTPS
- [ ] Added GitHub secrets
- [ ] Tested auto-deployment
- [ ] Verified everything works

---

# 🎯 CONGRATULATIONS! 🎉

You now have a fully automated deployment system!

**Just remember**:
1. Create folder in `sites/NewPage/`
2. Add `index.html`
3. `git add . && git commit -m "message" && git push`
4. Wait 30 seconds
5. Visit: https://letstradequotex.com/NewPage/

**Your website is live and updating automatically!** 🚀
