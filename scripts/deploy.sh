#!/bin/bash

###############################################################################
# Dreamcatcher Production Deployment Script
# This script handles deployment to production servers
###############################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOY_ENV="${1:-production}"

echo -e "${GREEN}🚀 Dreamcatcher Deployment Script${NC}"
echo -e "${GREEN}====================================${NC}"
echo ""
echo "Environment: $DEPLOY_ENV"
echo "Project Root: $PROJECT_ROOT"
echo ""

# Load environment variables
if [ -f "$PROJECT_ROOT/.env.$DEPLOY_ENV" ]; then
    echo -e "${GREEN}✓${NC} Loading environment variables from .env.$DEPLOY_ENV"
    set -a
    source "$PROJECT_ROOT/.env.$DEPLOY_ENV"
    set +a
else
    echo -e "${RED}✗${NC} .env.$DEPLOY_ENV file not found!"
    exit 1
fi

# Verify required environment variables
required_vars=(
    "DATABASE_URL"
    "REDIS_URL"
    "JWT_SECRET"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        echo -e "${RED}✗${NC} Required environment variable $var is not set"
        exit 1
    fi
done

echo -e "${GREEN}✓${NC} All required environment variables are set"
echo ""

###############################################################################
# Pre-deployment checks
###############################################################################

echo -e "${YELLOW}Running pre-deployment checks...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗${NC} Docker is not installed"
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker is installed"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗${NC} Docker Compose is not installed"
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker Compose is installed"

# Check if services are accessible
if ! curl -f -s -o /dev/null "$DATABASE_URL" 2>/dev/null; then
    echo -e "${YELLOW}⚠${NC}  Warning: Database connection test skipped (expected for PostgreSQL)"
fi

echo ""

###############################################################################
# Build Docker images
###############################################################################

echo -e "${YELLOW}Building Docker images...${NC}"

cd "$PROJECT_ROOT"

# Build API server
echo "Building API server..."
docker build -t dreamcatcher-api:latest -f server/Dockerfile .
echo -e "${GREEN}✓${NC} API server built"

# Build WebSocket server
echo "Building WebSocket server..."
docker build -t dreamcatcher-websocket:latest -f server/websocket/Dockerfile .
echo -e "${GREEN}✓${NC} WebSocket server built"

echo ""

###############################################################################
# Database migrations
###############################################################################

echo -e "${YELLOW}Running database migrations...${NC}"

# Stop API temporarily if running
if docker ps | grep -q dreamcatcher-api; then
    echo "Stopping API server for migrations..."
    docker-compose stop api
fi

# Run migrations
docker-compose run --rm api npm run migrate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Database migrations completed"
else
    echo -e "${RED}✗${NC} Database migrations failed"
    exit 1
fi

echo ""

###############################################################################
# Deploy services
###############################################################################

echo -e "${YELLOW}Deploying services...${NC}"

# Pull latest images (if using registry)
if [ -n "${DOCKER_REGISTRY:-}" ]; then
    echo "Pulling images from registry..."
    docker-compose pull
fi

# Start services
echo "Starting services with docker-compose..."
docker-compose up -d --remove-orphans

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 10

# Check health endpoints
echo "Checking API health..."
if curl -f -s http://localhost:3000/health > /dev/null; then
    echo -e "${GREEN}✓${NC} API server is healthy"
else
    echo -e "${RED}✗${NC} API server health check failed"
    docker-compose logs api
    exit 1
fi

echo "Checking WebSocket health..."
if curl -f -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}✓${NC} WebSocket server is healthy"
else
    echo -e "${RED}✗${NC} WebSocket server health check failed"
    docker-compose logs websocket
    exit 1
fi

echo ""

###############################################################################
# Cleanup
###############################################################################

echo -e "${YELLOW}Cleaning up...${NC}"

# Remove old images
echo "Removing dangling images..."
docker image prune -f

# Remove old containers
echo "Removing stopped containers..."
docker container prune -f

echo -e "${GREEN}✓${NC} Cleanup completed"
echo ""

###############################################################################
# Post-deployment tasks
###############################################################################

echo -e "${YELLOW}Running post-deployment tasks...${NC}"

# Warm up cache (optional)
if [ "${WARM_UP_CACHE:-false}" = "true" ]; then
    echo "Warming up cache..."
    # Add cache warming logic here
fi

# Send deployment notification
if [ -n "${SLACK_WEBHOOK:-}" ]; then
    echo "Sending deployment notification..."
    curl -X POST "$SLACK_WEBHOOK" \
        -H 'Content-Type: application/json' \
        -d "{\"text\":\"✅ Dreamcatcher deployed to $DEPLOY_ENV\"}"
fi

echo ""

###############################################################################
# Summary
###############################################################################

echo -e "${GREEN}====================================${NC}"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}====================================${NC}"
echo ""
echo "Environment: $DEPLOY_ENV"
echo "Services:"
echo "  - API:       http://localhost:3000"
echo "  - WebSocket: http://localhost:3001"
echo ""
echo "Logs:"
echo "  docker-compose logs -f"
echo ""
echo "Status:"
echo "  docker-compose ps"
echo ""

# Show running containers
docker-compose ps
