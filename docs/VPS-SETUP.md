# Complete VPS Setup Guide for Qhoster

## Prerequisites
- Qhoster VPS with root access
- Domain: letstradequotex.com pointed to VPS IP
- GitHub repository access

---

## 🚀 Quick Setup (Copy-Paste Commands)

### Step 1: Connect to Your VPS
```bash
ssh root@YOUR_VPS_IP
```

### Step 2: Run These Commands on VPS

```bash
# Update system and install required packages
apt update && apt upgrade -y
apt install -y nginx git rsync curl

# Create web directory
mkdir -p /var/www/letstradequotex.com
chown -R www-data:www-data /var/www/letstradequotex.com
chmod -R 755 /var/www/letstradequotex.com

# Create snippets directory
mkdir -p /etc/nginx/snippets

# Generate SSH key for GitHub access
ssh-keygen -t ed25519 -C "deploy@letstradequotex.com" -f /root/.ssh/id_ed25519 -N ""

# Display the public key (COPY THIS!)
echo "========== COPY THIS PUBLIC KEY =========="
cat /root/.ssh/id_ed25519.pub
echo "=========================================="
```

### Step 3: Add Deploy Key to GitHub

1. Copy the public key from the output above
2. Go to: https://github.com/frog-sand/Lets-Trade-Quotex-LP/settings/keys
3. Click "Add deploy key"
4. Title: `Qhoster VPS Deploy Key`
5. Paste the key
6. Click "Add key"

### Step 4: Test GitHub Connection & Complete Setup

```bash
# Test SSH connection to GitHub
ssh -T git@github.com
# Should say: "Hi frog-sand/Lets-Trade-Quotex-LP! You've successfully authenticated"

# Create deployment script
cat > /root/deploy-ltq.sh << 'DEPLOY_SCRIPT'
#!/bin/bash

set -e

REPO_DIR="/tmp/html-sites-deploy"
SITES_DIR="/var/www/letstradequotex.com"

echo "🚀 Starting deployment..."

# Clean up previous deployment
rm -rf $REPO_DIR

# Clone the repository using SSH
git clone git@github.com:frog-sand/Lets-Trade-Quotex-LP.git $REPO_DIR

# Copy sites to web directory (from sites/ folder)
mkdir -p $SITES_DIR
rsync -av --delete $REPO_DIR/sites/ $SITES_DIR/
chown -R www-data:www-data $SITES_DIR
chmod -R 755 $SITES_DIR

# Generate new Nginx configuration
bash $REPO_DIR/scripts/generate-nginx-config.sh

# Copy main nginx config
cp $REPO_DIR/nginx-config/letstradequotex.com.conf /etc/nginx/sites-available/letstradequotex.com

# Enable site if not already enabled
if [ ! -L /etc/nginx/sites-enabled/letstradequotex.com ]; then
    ln -s /etc/nginx/sites-available/letstradequotex.com /etc/nginx/sites-enabled/letstradequotex.com
fi

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx if test passes
systemctl reload nginx

echo "✅ Deployment completed successfully!"

# List deployed sites
echo ""
echo "📋 Currently deployed landing pages:"
ls -1 $SITES_DIR/ | while read site; do
    echo "   ✓ https://letstradequotex.com/$site/"
done
DEPLOY_SCRIPT

# Make deployment script executable
chmod +x /root/deploy-ltq.sh

# Run first deployment
/root/deploy-ltq.sh
```

### Step 5: Verify Deployment

Visit in your browser:
- http://YOUR_VPS_IP/Black/
- http://YOUR_VPS_IP/Blue/
- etc.

If DNS is propagated:
- http://letstradequotex.com/Black/
- http://letstradequotex.com/Blue/

---

## 🔒 Step 6: Setup SSL (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d letstradequotex.com -d www.letstradequotex.com

# Follow prompts:
# - Enter your email
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS (option 2)
```

Now your site will be accessible at:
- https://letstradequotex.com/Black/
- https://letstradequotex.com/Blue/

---

## 🤖 Step 7: Setup Auto-Deployment with GitHub Actions

### Get SSH Private Key

On your VPS:
```bash
cat /root/.ssh/id_ed25519
```

Copy the **entire output** (including BEGIN and END lines)

### Add GitHub Secrets

1. Go to: https://github.com/frog-sand/Lets-Trade-Quotex-LP/settings/secrets/actions
2. Click "New repository secret"
3. Add these 4 secrets:

| Secret Name | Value |
|-------------|-------|
| `SERVER_HOST` | Your VPS IP address |
| `SERVER_USER` | `root` |
| `SSH_PRIVATE_KEY` | The private key you copied above |
| `SERVER_PORT` | `22` |

### Test Auto-Deployment

```bash
# On your local machine
cd "c:\Users\choud\Desktop\Landing PAGE\Lets-Trade-Quotex-LP"

# Make a small change
echo "<!-- Test -->" >> sites/Black/index.html

# Commit and push
git add .
git commit -m "Test auto-deployment"
git push
```

Watch the deployment:
1. Go to: https://github.com/frog-sand/Lets-Trade-Quotex-LP/actions
2. You should see a workflow running
3. Wait for green checkmark
4. Visit: https://letstradequotex.com/Black/ to verify

---

## ✅ You're Done!

### How to Add New Landing Pages

1. **Create a new folder** in `sites/`:
   ```bash
   mkdir sites/NewPromo
   ```

2. **Add your HTML file**:
   ```bash
   # Copy your landing page HTML
   cp some-landing-page.html sites/NewPromo/index.html
   ```

3. **Commit and push**:
   ```bash
   git add sites/NewPromo/
   git commit -m "Add NewPromo landing page"
   git push
   ```

4. **Wait 30 seconds** for GitHub Actions to deploy

5. **Visit**: https://letstradequotex.com/NewPromo/

---

## 🔧 Useful Commands

### On VPS:
```bash
# Manual deployment
/root/deploy-ltq.sh

# Check nginx status
systemctl status nginx

# View nginx logs
tail -f /var/log/nginx/letstradequotex.com-error.log

# Restart nginx
systemctl restart nginx

# List all deployed sites
ls -la /var/www/letstradequotex.com/
```

### On Local Machine:
```bash
# Check GitHub Actions status
# Visit: https://github.com/frog-sand/Lets-Trade-Quotex-LP/actions

# Quick deploy
git add sites/
git commit -m "Update landing pages"
git push
```

---

## 🆘 Troubleshooting

### Site not accessible
```bash
# Check if nginx is running
systemctl status nginx

# Check DNS
nslookup letstradequotex.com
```

### GitHub Actions failing
1. Check logs at: https://github.com/frog-sand/Lets-Trade-Quotex-LP/actions
2. Verify GitHub secrets are correct
3. Test SSH on VPS: `ssh -T git@github.com`

### Permission errors
```bash
chown -R www-data:www-data /var/www/letstradequotex.com
chmod -R 755 /var/www/letstradequotex.com
```

---

## 📂 Your Project Structure

```
sites/
├── Black/
│   ├── index.html
│   └── LP11.JPEG
├── Blue/
│   └── index.html
├── Green/
│   └── index.html
└── NewPromo/          ← Just add folders like this!
    └── index.html
```

Each folder becomes: `letstradequotex.com/FolderName/`
