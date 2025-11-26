#!/bin/bash

###############################################################################
# Production Server Setup Script
# Run this on your production server to prepare the environment
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔧 Dreamcatcher Production Server Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}✗${NC} Please run as root (use sudo)"
    exit 1
fi

###############################################################################
# Install Docker
###############################################################################

echo -e "${YELLOW}Installing Docker...${NC}"

if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker is already installed"
else
    # Update package index
    apt-get update

    # Install dependencies
    apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    # Add Docker's official GPG key
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    # Set up repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker Engine
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    echo -e "${GREEN}✓${NC} Docker installed"
fi

# Start Docker service
systemctl start docker
systemctl enable docker

###############################################################################
# Install Docker Compose
###############################################################################

echo -e "${YELLOW}Installing Docker Compose...${NC}"

if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Compose is already installed"
else
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    echo -e "${GREEN}✓${NC} Docker Compose installed"
fi

###############################################################################
# Install additional tools
###############################################################################

echo -e "${YELLOW}Installing additional tools...${NC}"

apt-get install -y \
    git \
    curl \
    wget \
    htop \
    ufw \
    certbot \
    python3-certbot-nginx

echo -e "${GREEN}✓${NC} Additional tools installed"

###############################################################################
# Configure firewall
###############################################################################

echo -e "${YELLOW}Configuring firewall...${NC}"

# Allow SSH
ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow custom ports (if needed)
# ufw allow 3000/tcp  # API
# ufw allow 3001/tcp  # WebSocket

# Enable firewall
ufw --force enable

echo -e "${GREEN}✓${NC} Firewall configured"

###############################################################################
# Create application directory
###############################################################################

echo -e "${YELLOW}Creating application directory...${NC}"

APP_DIR="/opt/dreamcatcher"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

echo -e "${GREEN}✓${NC} Application directory created: $APP_DIR"

###############################################################################
# Set up SSL certificates
###############################################################################

echo -e "${YELLOW}Setting up SSL certificates...${NC}"

read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN

if [ -n "$DOMAIN" ]; then
    # Request SSL certificate
    certbot certonly --standalone -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} SSL certificates obtained"
    else
        echo -e "${YELLOW}⚠${NC}  SSL certificate setup failed (you can retry later)"
    fi
else
    echo -e "${YELLOW}⚠${NC}  Skipping SSL setup"
fi

###############################################################################
# Set up automatic certificate renewal
###############################################################################

echo -e "${YELLOW}Setting up automatic certificate renewal...${NC}"

# Add cron job for certificate renewal
(crontab -l 2>/dev/null; echo "0 0 * * * certbot renew --quiet --post-hook 'docker-compose -f /opt/dreamcatcher/docker-compose.yml restart nginx'") | crontab -

echo -e "${GREEN}✓${NC} Certificate auto-renewal configured"

###############################################################################
# Create systemd service
###############################################################################

echo -e "${YELLOW}Creating systemd service...${NC}"

cat > /etc/systemd/system/dreamcatcher.service <<EOF
[Unit]
Description=Dreamcatcher Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/dreamcatcher
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
systemctl daemon-reload

echo -e "${GREEN}✓${NC} Systemd service created"

###############################################################################
# Set up log rotation
###############################################################################

echo -e "${YELLOW}Setting up log rotation...${NC}"

cat > /etc/logrotate.d/dreamcatcher <<EOF
/opt/dreamcatcher/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
    postrotate
        docker-compose -f /opt/dreamcatcher/docker-compose.yml kill -s USR1 api websocket
    endscript
}
EOF

echo -e "${GREEN}✓${NC} Log rotation configured"

###############################################################################
# Set up monitoring
###############################################################################

echo -e "${YELLOW}Setting up monitoring...${NC}"

# Install node_exporter for Prometheus monitoring (optional)
read -p "Install Prometheus node_exporter? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    wget https://github.com/prometheus/node_exporter/releases/latest/download/node_exporter-*.linux-amd64.tar.gz
    tar xvfz node_exporter-*.linux-amd64.tar.gz
    mv node_exporter-*/node_exporter /usr/local/bin/
    rm -rf node_exporter-*

    # Create systemd service
    cat > /etc/systemd/system/node_exporter.service <<EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl start node_exporter
    systemctl enable node_exporter

    echo -e "${GREEN}✓${NC} Node exporter installed"
fi

###############################################################################
# Configure system limits
###############################################################################

echo -e "${YELLOW}Configuring system limits...${NC}"

# Increase file descriptor limits
cat >> /etc/security/limits.conf <<EOF
* soft nofile 65536
* hard nofile 65536
EOF

# Configure sysctl
cat >> /etc/sysctl.conf <<EOF
# Dreamcatcher optimizations
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.ip_local_port_range = 1024 65535
vm.max_map_count = 262144
EOF

sysctl -p

echo -e "${GREEN}✓${NC} System limits configured"

###############################################################################
# Summary
###############################################################################

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Production server setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Clone your repository to $APP_DIR"
echo "2. Create .env.production file with your secrets"
echo "3. Run the deployment script: ./scripts/deploy.sh production"
echo ""
echo "Useful commands:"
echo "  - Start services: systemctl start dreamcatcher"
echo "  - Stop services: systemctl stop dreamcatcher"
echo "  - View logs: docker-compose -f $APP_DIR/docker-compose.yml logs -f"
echo "  - Check status: docker-compose -f $APP_DIR/docker-compose.yml ps"
echo ""
