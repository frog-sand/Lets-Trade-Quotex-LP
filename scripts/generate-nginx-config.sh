#!/bin/bash

SITES_DIR="/var/www/eliteworld.online"
LOCATIONS_SNIPPET="/etc/nginx/snippets/agenzy-locations.conf"

# Backup existing snippet
sudo cp $LOCATIONS_SNIPPET ${LOCATIONS_SNIPPET}.backup 2>/dev/null || echo "No previous config to backup"

# Generate temporary snippet
cat > /tmp/agenzy-locations.conf << 'EOF'
    # Auto-generated Agenzy site locations
EOF

# Add location blocks for each Agenzy directory
for dir in $SITES_DIR/Agenzy*/; do
    if [ -d "$dir" ]; then
        basename_dir=$(basename "$dir")
        cat >> /tmp/agenzy-locations.conf << EOF
    location /$basename_dir/ {
        alias $SITES_DIR/$basename_dir/;
        index index.html;
        try_files \$uri \$uri/ /$basename_dir/index.html;
    }

EOF
    fi
done

# Add fallback location
cat >> /tmp/agenzy-locations.conf << 'EOF'
    # Fallback for undefined paths
    location / {
        try_files $uri $uri/ =404;
    }
EOF

# Move to final location
sudo mv /tmp/agenzy-locations.conf $LOCATIONS_SNIPPET

echo "✅ Locations updated for $(ls -1d $SITES_DIR/Agenzy*/ 2>/dev/null | wc -l) Agenzy sites"
