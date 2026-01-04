# LTQ Sites Deployment Guide

This guide will help you deploy your multi-landing-page website with automatic deployment on git push.

## 🎯 What You'll Achieve

- Domain: `letstradequotex.com`
- Sub-paths: `/Black/`, `/Blue/`, `/Green/`, etc.
- Auto-deployment: Push to GitHub → Automatically updates live site
- Each folder in `sites/` directory becomes a landing page

---

## 📋 Prerequisites

1. **Domain**: `letstradequotex.com` (already owned, parked on Qhoster)
2. **Server**: A Linux VPS with root access (Ubuntu 20.04+ recommended)
   - DigitalOcean ($6/month)
   - AWS EC2 (Free tier)
   - Linode ($5/month)
   - Or use Qhoster VPS if available
3. **GitHub Account**: Repository at https://github.com/aditiyah7/LTQ-Sites

---

## 🚀 Step-by-Step Setup

### PHASE 1: Get a VPS Server

#### Option A: DigitalOcean (Recommended)
1. Sign up at https://www.digitalocean.com
2. Create a new Droplet:
   - Choose: Ubuntu 22.04 LTS
   - Plan: Basic ($6/month)
   - Choose datacenter closest to your users
3. Note down the IP address

#### Option B: AWS EC2 Free Tier
1. Sign up at https://aws.amazon.com
2. Launch EC2 instance:
   - AMI: Ubuntu 22.04
   - Instance type: t2.micro (free tier)
3. Configure security group (allow ports 22, 80, 443)
4. Note down the public IP

---

### PHASE 2: Point Domain to Server

1. Login to **Qhoster** control panel
2. Navigate to **DNS Management** for `letstradequotex.com`
3. Add/Update these DNS records:

   ```
   Type: A Record
   Host: @ (or leave blank)
   Value: YOUR_SERVER_IP_ADDRESS
   TTL: 3600

   Type: A Record
   Host: www
   Value: YOUR_SERVER_IP_ADDRESS
   TTL: 3600
   ```

4. Wait 10-30 minutes for DNS propagation

---

### PHASE 3: Server Setup

#### Step 1: Connect to Server

```bash
ssh root@YOUR_SERVER_IP
```

If using AWS with key file:
```bash
ssh -i your-key.pem ubuntu@YOUR_SERVER_IP
```

#### Step 2: Run Server Setup Script

On your **local machine**, upload the setup script:
```bash
scp server-setup/setup-server.sh root@YOUR_SERVER_IP:/root/
```

On your **server**, run:
```bash
cd /root
chmod +x setup-server.sh
./setup-server.sh
```

#### Step 3: Setup GitHub SSH Access

On your **server**:
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "deploy@letstradequotex.com" -f /root/.ssh/id_ed25519 -N ""

# Display public key
cat /root/.ssh/id_ed25519.pub
```

Copy the output, then:
1. Go to: https://github.com/aditiyah7/LTQ-Sites/settings/keys
2. Click **"Add deploy key"**
3. Title: `Server Deploy Key`
4. Paste the key
5. ✅ Check **"Allow write access"** (if you want server to push)
6. Click **"Add key"**

Test the connection:
```bash
ssh -T git@github.com
# Should say: "Hi aditiyah7/LTQ-Sites! You've successfully authenticated"
```

#### Step 4: Configure Nginx

On your **server**:
```bash
# Upload nginx config (run this from your local machine)
# First, commit and push the nginx config to GitHub
```

On **local machine**:
```bash
git add nginx-config/letstradequotex.com.conf
git commit -m "Add nginx configuration"
git push
```

On **server**:
```bash
# Clone repo temporarily to get config
git clone git@github.com:aditiyah7/LTQ-Sites.git /tmp/ltq-setup
cd /tmp/ltq-setup

# Copy nginx config
cp nginx-config/letstradequotex.com.conf /etc/nginx/sites-available/letstradequotex.com
ln -s /etc/nginx/sites-available/letstradequotex.com /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# If test passes, restart nginx
systemctl restart nginx
```

#### Step 5: First Manual Deployment

On your **server**:
```bash
/root/deploy-ltq.sh
```

This will:
- Clone your GitHub repo
- Copy all sites to `/var/www/letstradequotex.com/`
- Generate nginx location blocks
- Reload nginx

Test in browser: `http://letstradequotex.com/Black/`

---

### PHASE 4: Setup Auto-Deployment with GitHub Actions

#### Step 1: Create GitHub Secrets

On your **server**, get the private key:
```bash
cat /root/.ssh/id_ed25519
```

Copy the entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

Now on **GitHub**:
1. Go to: https://github.com/aditiyah7/LTQ-Sites/settings/secrets/actions
2. Click **"New repository secret"**
3. Add these secrets:

   | Name | Value |
   |------|-------|
   | `SERVER_HOST` | Your server IP address |
   | `SERVER_USER` | `root` (or `ubuntu` for AWS) |
   | `SSH_PRIVATE_KEY` | The private key you copied |
   | `SERVER_PORT` | `22` (default SSH port) |

#### Step 2: Commit and Push GitHub Actions Workflow

On your **local machine**:
```bash
git add .github/workflows/deploy.yml
git add scripts/deploy.sh
git add scripts/generate-nginx-config.sh
git commit -m "Add auto-deployment workflow"
git push
```

#### Step 3: Test Auto-Deployment

1. Go to: https://github.com/aditiyah7/LTQ-Sites/actions
2. You should see a workflow run started
3. Wait for it to complete (green checkmark)
4. Visit: `http://letstradequotex.com/Black/` to verify

---

### PHASE 5: Add SSL Certificate (HTTPS)

On your **server**:
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d letstradequotex.com -d www.letstradequotex.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS (option 2)
```

Auto-renewal is set up automatically. Test with:
```bash
certbot renew --dry-run
```

---

## 🎉 How It Works Now

### Adding a New Landing Page

1. Create a new folder in `sites/` (e.g., `sites/Orange/`)
2. Add `index.html` and any images
3. Commit and push:
   ```bash
   git add sites/Orange/
   git commit -m "Add Orange landing page"
   git push
   ```
4. GitHub Actions automatically deploys
5. Visit: `https://letstradequotex.com/Orange/`

### Updating Existing Pages

1. Edit files in `sites/Black/index.html` (or any other)
2. Commit and push:
   ```bash
   git add sites/Black/index.html
   git commit -m "Update Black page"
   git push
   ```
3. Live site updates automatically in ~30 seconds

---

## 🔧 Troubleshooting

### DNS not resolving
```bash
# Check DNS propagation
nslookup letstradequotex.com
# or visit: https://dnschecker.org
```

### Deployment fails
```bash
# Check server logs
ssh root@YOUR_SERVER_IP
tail -f /var/log/nginx/error.log
```

### GitHub Actions failing
1. Check: https://github.com/aditiyah7/LTQ-Sites/actions
2. Click on failed workflow
3. Check logs for errors
4. Verify GitHub secrets are set correctly

### 502 Bad Gateway
```bash
# Restart nginx
systemctl restart nginx
```

---

## 📁 Project Structure

```
LTQ-Sites/
├── sites/                      # Your landing pages
│   ├── Black/
│   │   ├── index.html
│   │   └── LP11.JPEG
│   ├── Blue/
│   ├── Green/
│   └── ...
├── scripts/
│   ├── deploy.sh              # Main deployment script
│   └── generate-nginx-config.sh  # Auto-generates nginx configs
├── nginx-config/
│   └── letstradequotex.com.conf  # Nginx server config
├── .github/workflows/
│   └── deploy.yml             # GitHub Actions auto-deploy
└── server-setup/
    └── setup-server.sh        # One-time server setup
```

---

## 🎯 Quick Reference

### Commands

```bash
# Manual deployment (on server)
/root/deploy-ltq.sh

# Check nginx status
systemctl status nginx

# Reload nginx
systemctl reload nginx

# View nginx error log
tail -f /var/log/nginx/error.log

# Test nginx config
nginx -t

# View deployed sites
ls -la /var/www/letstradequotex.com/
```

### URLs

- Repository: https://github.com/aditiyah7/LTQ-Sites
- GitHub Actions: https://github.com/aditiyah7/LTQ-Sites/actions
- GitHub Secrets: https://github.com/aditiyah7/LTQ-Sites/settings/secrets/actions

---

## 🆘 Getting Help

If you encounter issues:

1. Check GitHub Actions logs
2. SSH to server and check nginx logs
3. Verify DNS is pointing correctly
4. Check file permissions: `ls -la /var/www/letstradequotex.com/`

---

## ✅ Success Checklist

- [ ] Server created and accessible via SSH
- [ ] Domain DNS pointing to server IP
- [ ] GitHub deploy key added
- [ ] Nginx installed and configured
- [ ] Manual deployment works
- [ ] GitHub Actions secrets configured
- [ ] Auto-deployment working on push
- [ ] SSL certificate installed
- [ ] All landing pages accessible via HTTPS

---

**You're all set! 🎉** Every time you push to GitHub, your site automatically updates!
