# Architecture Overview

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

  1. You create/edit files locally
     └── sites/Black/index.html
     └── sites/Blue/index.html
     └── sites/NewColor/index.html  (new folder = new landing page!)

  2. Commit and Push
     └── git add .
     └── git commit -m "Update Black page"
     └── git push

              ↓

┌─────────────────────────────────────────────────────────────────┐
│                        GITHUB                                    │
└─────────────────────────────────────────────────────────────────┘

  3. GitHub receives your push
     └── Repo: github.com/frog-sand/Lets-Trade-Quotex-LP

  4. GitHub Actions triggers
     └── .github/workflows/deploy.yml starts

              ↓

┌─────────────────────────────────────────────────────────────────┐
│                     YOUR VPS SERVER                              │
│                  (DigitalOcean/AWS/etc)                          │
└─────────────────────────────────────────────────────────────────┘

  5. GitHub Actions connects to server via SSH

  6. Runs deployment script
     └── /root/deploy-ltq.sh
         ├── Clones latest code from GitHub
         ├── Copies sites/ to /var/www/letstradequotex.com/
         ├── Generates Nginx config for each folder
         └── Reloads Nginx

  7. Nginx serves your sites
     └── Port 80/443 (HTTP/HTTPS)

              ↓

┌─────────────────────────────────────────────────────────────────┐
│                          INTERNET                                │
└─────────────────────────────────────────────────────────────────┘

  8. DNS (from Qhoster)
     letstradequotex.com → YOUR_SERVER_IP

  9. Users visit:
     ✅ https://letstradequotex.com/Black/
     ✅ https://letstradequotex.com/Blue/
     ✅ https://letstradequotex.com/Green/
     ✅ https://letstradequotex.com/NewColor/  (any new folder!)
```

## File Structure on Server

```
/var/www/letstradequotex.com/
├── Black/
│   ├── index.html       → https://letstradequotex.com/Black/
│   └── LP11.JPEG
├── Blue/
│   ├── index.html       → https://letstradequotex.com/Blue/
│   └── LP2.JPEG
├── Green/
│   ├── index.html       → https://letstradequotex.com/Green/
│   └── LP7.JPEG
└── [Any new folder you create in sites/]
```

## Key Components

### 1. GitHub Repository
- **Location**: https://github.com/frog-sand/Lets-Trade-Quotex-LP
- **Purpose**: Version control and trigger point for deployments

### 2. GitHub Actions
- **File**: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- **Trigger**: Every push to `main` branch
- **Action**: SSH to server and run deployment script

### 3. VPS Server
- **Role**: Hosts your website
- **Web Server**: Nginx
- **Directory**: `/var/www/letstradequotex.com/`

### 4. Deployment Script
- **File**: [scripts/deploy.sh](scripts/deploy.sh)
- **What it does**:
  1. Clones repo from GitHub
  2. Copies all `sites/*` folders to web directory
  3. Generates Nginx location blocks automatically
  4. Reloads Nginx

### 5. Nginx Config Generator
- **File**: [scripts/generate-nginx-config.sh](scripts/generate-nginx-config.sh)
- **What it does**: Scans `/var/www/letstradequotex.com/` and creates a location block for each folder

### 6. Nginx Server Config
- **File**: [nginx-config/letstradequotex.com.conf](nginx-config/letstradequotex.com.conf)
- **What it does**: Defines how Nginx serves your domain

## How Auto-Deployment Works

### Scenario: Adding a new landing page

```
Step 1: Create folder locally
  └── sites/Orange/
      ├── index.html
      └── image.jpg

Step 2: Push to GitHub
  $ git add sites/Orange/
  $ git commit -m "Add Orange landing page"
  $ git push

Step 3: GitHub Actions (automatic)
  ✓ Detects push to main
  ✓ Connects to server via SSH
  ✓ Runs /root/deploy-ltq.sh

Step 4: Deployment script (automatic)
  ✓ Clones latest code
  ✓ Copies sites/Orange/ to /var/www/letstradequotex.com/Orange/
  ✓ Runs generate-nginx-config.sh

Step 5: Nginx config generator (automatic)
  ✓ Finds new Orange/ folder
  ✓ Creates location block:
    location /Orange/ {
        alias /var/www/letstradequotex.com/Orange/;
        index index.html;
    }
  ✓ Reloads Nginx

Step 6: LIVE!
  ✅ https://letstradequotex.com/Orange/
```

**Total time: ~30-60 seconds** from push to live!

## Security Features

1. **SSH Key Authentication**: No passwords stored
2. **GitHub Secrets**: Credentials encrypted
3. **HTTPS**: SSL/TLS encryption via Let's Encrypt
4. **Read-only Deploy Key**: GitHub can't modify your server

## Scaling

### To add more landing pages:
Just create folders in `sites/` - no config needed!

### To add more domains:
1. Copy `nginx-config/letstradequotex.com.conf`
2. Change `server_name` and `root` path
3. Update DNS
4. Get SSL certificate

## Troubleshooting Flow

```
Issue: Site not updating after push
  │
  ├─→ Check GitHub Actions
  │   └── https://github.com/frog-sand/Lets-Trade-Quotex-LP/actions
  │       ├─→ Green ✓: Deployment succeeded
  │       └─→ Red ✗: Check logs for error
  │
  ├─→ Check server deployment
  │   └── SSH to server: tail -f /var/log/nginx/error.log
  │
  └─→ Check DNS
      └── nslookup letstradequotex.com
```

## Backup Strategy

Your code is on GitHub, so you have automatic backups. For server:

```bash
# Backup sites
tar -czf ltq-backup-$(date +%Y%m%d).tar.gz /var/www/letstradequotex.com/

# Backup nginx config
cp /etc/nginx/sites-available/letstradequotex.com.conf ~/backup/
```

## Cost Estimate

| Item | Cost |
|------|------|
| Domain (Qhoster) | Already owned |
| VPS (DigitalOcean) | $6/month |
| SSL Certificate | Free (Let's Encrypt) |
| GitHub | Free |
| **Total** | **$6/month** |

## Performance

- **Deploy Time**: 30-60 seconds
- **Page Load**: <1 second (with nginx gzip)
- **Concurrent Users**: 100+ (basic VPS)
- **Uptime**: 99.9% (VPS dependent)

---

**Simple, automated, and scalable!** 🚀
