# Quick Start Guide - LTQ Sites Auto-Deployment

## 🎯 Goal
Auto-deploy landing pages to `letstradequotex.com` when you push to GitHub.

## 📝 Summary of What's Set Up

I've configured your project with:

1. **Updated deployment scripts** - Now uses your domain `letstradequotex.com`
2. **Nginx configuration** - Server setup for your domain
3. **GitHub Actions workflow** - Auto-deploys on every push to `main` branch
4. **Server setup script** - One-command server installation

## 🚀 Next Steps (In Order)

### 1. Get a VPS Server (15 minutes)
Choose one:
- **DigitalOcean**: https://www.digitalocean.com ($6/month)
- **AWS EC2**: https://aws.amazon.com/free (Free tier)
- **Linode**: https://www.linode.com ($5/month)

You need: Ubuntu 22.04, minimum 1GB RAM

### 2. Point Your Domain (5 minutes)
In Qhoster DNS settings for `letstradequotex.com`:
- Add A Record: `@` → `YOUR_SERVER_IP`
- Add A Record: `www` → `YOUR_SERVER_IP`

### 3. Setup Server (20 minutes)
```bash
# Connect to server
ssh root@YOUR_SERVER_IP

# Download and run setup script
curl -o setup-server.sh https://raw.githubusercontent.com/aditiyah7/LTQ-Sites/main/server-setup/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

### 4. Configure GitHub SSH (5 minutes)
On server:
```bash
ssh-keygen -t ed25519 -C "deploy@ltq" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Add the output to: https://github.com/aditiyah7/LTQ-Sites/settings/keys

### 5. Configure Nginx (5 minutes)
```bash
# Get config from repo
git clone git@github.com:aditiyah7/LTQ-Sites.git /tmp/ltq
cp /tmp/ltq/nginx-config/letstradequotex.com.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/letstradequotex.com.conf /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
```

### 6. First Deployment (2 minutes)
```bash
/root/deploy-ltq.sh
```

Test: Visit `http://letstradequotex.com/Black/`

### 7. Setup Auto-Deployment (5 minutes)

Get server SSH key:
```bash
cat ~/.ssh/id_ed25519
```

Add GitHub secrets at: https://github.com/aditiyah7/LTQ-Sites/settings/secrets/actions

| Secret Name | Value |
|------------|-------|
| `SERVER_HOST` | Your server IP |
| `SERVER_USER` | `root` |
| `SSH_PRIVATE_KEY` | Full private key (from above command) |
| `SERVER_PORT` | `22` |

### 8. Add SSL (5 minutes)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d letstradequotex.com -d www.letstradequotex.com
```

## ✅ Test Auto-Deployment

1. Edit any file in `sites/Black/index.html`
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push
   ```
3. Watch it deploy at: https://github.com/aditiyah7/LTQ-Sites/actions
4. Visit: `https://letstradequotex.com/Black/`

## 🎉 Done!

Now every time you:
- Add a new folder in `sites/NewColor/`
- Push to GitHub
- It automatically appears at `letstradequotex.com/NewColor/`

## 📚 Full Documentation

See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for detailed instructions.

## 🆘 Issues?

1. Check GitHub Actions: https://github.com/aditiyah7/LTQ-Sites/actions
2. Check server nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify DNS: `nslookup letstradequotex.com`
