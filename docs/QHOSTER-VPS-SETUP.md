# Qhoster VPS Setup - Step by Step

## Your VPS Details
- **IP Address**: `54.37.196.113`
- **Hostname**: `41586038.securefastserver.com`
- **Status**: Online ✅

---

## 🔑 STEP 1: Access Your VPS (Choose ONE method)

### Method A: Use VNC Console (Easiest - No Password Needed!)

1. **Login to Qhoster Client Area**: https://client.qhoster.com/
2. **Go to**: Services → My Services
3. **Click on**: `Linux KVM VPS 1`
4. **Click the "VNC" button**
5. **A console window will open** - you're now connected to your server!

### Method B: SSH with Password

1. **Find your root password** in the email from Qhoster
2. **Open Command Prompt** (Windows) or Terminal (Mac/Linux)
3. **Type**:
   ```bash
   ssh root@54.37.196.113
   ```
4. **Enter the password** when prompted (you won't see it as you type)

### Method C: Reset Password First

1. **Login to Qhoster Client Area**
2. **Click on your VPS**: `Linux KVM VPS 1`
3. **Click "Rescue Mode"** button
4. **Follow instructions to reset root password**
5. **Reboot the VPS**
6. **SSH with new password**:
   ```bash
   ssh root@54.37.196.113
   ```

---

## 🚀 STEP 2: Once Connected to VPS (Copy-Paste These Commands)

After you're logged in (via VNC or SSH), copy and paste these commands **one section at a time**:

### Part 1: Update System and Install Software
```bash
apt update && apt upgrade -y
apt install -y nginx git rsync curl
```

### Part 2: Create Web Directory
```bash
mkdir -p /var/www/letstradequotex.com
chown -R www-data:www-data /var/www/letstradequotex.com
chmod -R 755 /var/www/letstradequotex.com
mkdir -p /etc/nginx/snippets
```

### Part 3: Generate SSH Key for GitHub
```bash
ssh-keygen -t ed25519 -C "deploy@letstradequotex.com" -f /root/.ssh/id_ed25519 -N ""
```

### Part 4: Display Public Key (COPY THIS!)
```bash
echo "========================================="
echo "COPY THIS PUBLIC KEY:"
echo "========================================="
cat /root/.ssh/id_ed25519.pub
echo "========================================="
```

**STOP HERE** and copy the public key that appears.

---

## 🔐 STEP 3: Add Deploy Key to GitHub

1. **Copy the public key** from Step 2 Part 4 above
2. **Go to**: https://github.com/frog-sand/Lets-Trade-Quotex-LP/settings/keys
3. **Click**: "Add deploy key"
4. **Title**: `Qhoster VPS`
5. **Paste the key** in the "Key" field
6. **Click**: "Add key"

---

## 🔄 STEP 4: Test GitHub Connection and Deploy

Back in your VPS terminal (VNC or SSH), run:

```bash
# Test GitHub connection
ssh -T git@github.com
# Should say: "Hi frog-sand/Lets-Trade-Quotex-LP! You've successfully authenticated"
```

If you see an error about host authenticity, type: `yes` and press Enter.

---

## 📝 STEP 5: Create Deployment Script

Copy and paste this entire block:

```bash
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

# Copy sites to web directory
mkdir -p $SITES_DIR
rsync -av --delete $REPO_DIR/sites/ $SITES_DIR/
chown -R www-data:www-data $SITES_DIR
chmod -R 755 $SITES_DIR

# Generate nginx config
bash $REPO_DIR/scripts/generate-nginx-config.sh

# Copy main nginx config
cp $REPO_DIR/nginx-config/letstradequotex.com.conf /etc/nginx/sites-available/letstradequotex.com

# Enable site
if [ ! -L /etc/nginx/sites-enabled/letstradequotex.com ]; then
    ln -s /etc/nginx/sites-available/letstradequotex.com /etc/nginx/sites-enabled/letstradequotex.com
fi

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx

echo "✅ Deployment completed!"
echo ""
echo "📋 Deployed landing pages:"
ls -1 $SITES_DIR/ | while read site; do
    echo "   ✓ http://54.37.196.113/$site/"
done
DEPLOY_SCRIPT

chmod +x /root/deploy-ltq.sh
```

---

## 🎯 STEP 6: Run First Deployment

```bash
/root/deploy-ltq.sh
```

This will deploy all your landing pages!

### Test Your Site

Open in browser:
- http://54.37.196.113/Black/
- http://54.37.196.113/Blue/
- http://54.37.196.113/Green/

---

## 🌐 STEP 7: Point Your Domain to VPS

1. **Login to Qhoster Control Panel**
2. **Go to**: Domains → DNS Management → letstradequotex.com
3. **Add these DNS records**:

   | Type | Host | Value | TTL |
   |------|------|-------|-----|
   | A | @ | 54.37.196.113 | 3600 |
   | A | www | 54.37.196.113 | 3600 |

4. **Wait 10-30 minutes** for DNS propagation

5. **Test**: http://letstradequotex.com/Black/

---

## 🔒 STEP 8: Add SSL Certificate (HTTPS)

On your VPS, run:

```bash
apt install -y certbot python3-certbot-nginx

certbot --nginx -d letstradequotex.com -d www.letstradequotex.com
```

Follow the prompts:
- Enter your email
- Agree to terms (type `y`)
- Choose option 2 (Redirect HTTP to HTTPS)

Now visit: **https://letstradequotex.com/Black/** 🎉

---

## 🤖 STEP 9: Setup Auto-Deployment with GitHub Actions

### Get SSH Private Key

On your VPS:
```bash
cat /root/.ssh/id_ed25519
```

**Copy the entire output** (including BEGIN and END lines)

### Add to GitHub Secrets

1. Go to: https://github.com/frog-sand/Lets-Trade-Quotex-LP/settings/secrets/actions
2. Click "New repository secret"
3. Add these 4 secrets:

| Secret Name | Value |
|-------------|-------|
| `SERVER_HOST` | `54.37.196.113` |
| `SERVER_USER` | `root` |
| `SSH_PRIVATE_KEY` | Paste the entire private key |
| `SERVER_PORT` | `22` |

### Test Auto-Deployment

On your **local computer**:
```bash
cd "c:\Users\choud\Desktop\Landing PAGE\Lets-Trade-Quotex-LP"

# Make a test change
git commit --allow-empty -m "Test auto-deployment"
git push
```

Watch it deploy:
- Go to: https://github.com/frog-sand/Lets-Trade-Quotex-LP/actions
- You should see a workflow running
- Wait for green checkmark ✅

---

## ✅ YOU'RE DONE!

### How to Add New Landing Pages Now:

1. **Create folder**: `sites/MyNewLanding/`
2. **Add HTML**: `sites/MyNewLanding/index.html`
3. **Commit and push**:
   ```bash
   git add sites/MyNewLanding/
   git commit -m "Add new landing page"
   git push
   ```
4. **Wait 30 seconds**
5. **Visit**: https://letstradequotex.com/MyNewLanding/

---

## 🆘 Common Issues

### "Permission denied" when SSH
- Use VNC console instead (Method A in Step 1)
- Or reset your root password (Method C in Step 1)

### "Could not resolve hostname"
- Check you typed the IP correctly: `54.37.196.113`
- Try: `ping 54.37.196.113`

### Site not loading after DNS setup
- Wait longer (DNS can take up to 48 hours, usually 10-30 mins)
- Test with IP: http://54.37.196.113/Black/

### GitHub Actions asks for password
- Make sure you added `SSH_PRIVATE_KEY` to GitHub Secrets (Step 9)
- The private key should start with `-----BEGIN OPENSSH PRIVATE KEY-----`

---

## 📞 Quick Reference

**VPS IP**: `54.37.196.113`
**Domain**: `letstradequotex.com`
**GitHub Repo**: https://github.com/frog-sand/Lets-Trade-Quotex-LP
**GitHub Actions**: https://github.com/frog-sand/Lets-Trade-Quotex-LP/actions
**GitHub Secrets**: https://github.com/frog-sand/Lets-Trade-Quotex-LP/settings/secrets/actions

**Manual Deploy Command**:
```bash
ssh root@54.37.196.113
/root/deploy-ltq.sh
```
