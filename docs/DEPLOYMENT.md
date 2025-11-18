# Dreamcatcher Deployment Guide

Complete guide for deploying Dreamcatcher to production.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌───────────┐              │
│  │  Client  │───│  CDN/    │───│  Backend  │              │
│  │  (React) │   │  Vercel  │   │  API      │              │
│  └──────────┘   └──────────┘   └───────────┘              │
│                                       │                      │
│                                       ├─────────┐           │
│                                       │         │           │
│                           ┌───────────▼──┐  ┌──▼─────────┐│
│                           │  PostgreSQL   │  │ WebSocket  ││
│                           │  (Supabase)   │  │  Server    ││
│                           └───────────────┘  └────────────┘│
│                                       │                      │
│                           ┌───────────▼──────────────┐      │
│                           │  Redis (Scaling/Cache)   │      │
│                           └──────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Domain name
- SSL certificate (Let's Encrypt)
- Cloud accounts: Vercel, AWS/GCP/Azure, Stripe

## 1. Database Setup

### PostgreSQL (Supabase)

```bash
# 1. Create Supabase project
# Visit https://supabase.com/dashboard

# 2. Run migrations
psql -h your-project.supabase.co -U postgres -d postgres -f server/database/migrations/20240101_add_commercialization_tables.sql

# 3. Configure row-level security
# Enable RLS on all tables in Supabase dashboard

# 4. Set up storage buckets
# Create buckets: avatars, attachments, exports
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:password@host:5432/dreamcatcher
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NEXTAUTH_SECRET=your-nextauth-secret

# API Keys
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Infrastructure
REDIS_URL=redis://localhost:6379
WEBSOCKET_PORT=3001
API_PORT=3000
CLIENT_URL=https://dreamcatcher.app
```

## 2. Frontend Deployment (Vercel)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Configure vercel.json
cat > vercel.json << EOF
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "@api_url",
    "VITE_WS_URL": "@ws_url",
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
EOF

# 3. Deploy
vercel --prod

# 4. Configure custom domain
# Visit Vercel dashboard → Domains
```

## 3. Backend API Deployment (AWS/GCP/Azure)

### Option A: Docker Deployment

```bash
# 1. Build Docker image
cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY server/ ./server/
EXPOSE 3000
CMD ["node", "server/api/index.js"]
EOF

docker build -t dreamcatcher-api .

# 2. Push to registry
docker tag dreamcatcher-api:latest your-registry.com/dreamcatcher-api:latest
docker push your-registry.com/dreamcatcher-api:latest

# 3. Deploy to Kubernetes
kubectl apply -f k8s/api-deployment.yaml
```

### Option B: Serverless (AWS Lambda)

```bash
# 1. Install Serverless Framework
npm i -g serverless

# 2. Configure serverless.yml
# See server/api/serverless.yml

# 3. Deploy
cd server/api
serverless deploy --stage production
```

## 4. WebSocket Server Deployment

```bash
# 1. Navigate to WebSocket server
cd server/websocket

# 2. Install dependencies
npm install

# 3. Build Docker image
docker build -t dreamcatcher-websocket .

# 4. Deploy to container service
# AWS ECS, Google Cloud Run, or Azure Container Instances

# 5. Configure load balancer
# Enable WebSocket support (sticky sessions)
# Configure health check: /health

# 6. Set up Redis
# AWS ElastiCache, Google Cloud Memorystore, or Azure Cache for Redis
```

## 5. Redis Setup

### AWS ElastiCache

```bash
# 1. Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id dreamcatcher-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1

# 2. Get connection endpoint
aws elasticache describe-cache-clusters \
  --cache-cluster-id dreamcatcher-redis

# 3. Update REDIS_URL environment variable
```

## 6. CDN Setup (CloudFlare)

```bash
# 1. Add domain to CloudFlare
# Visit CloudFlare dashboard

# 2. Configure DNS
# A record: @ → Vercel IP
# CNAME: api → Your API domain
# CNAME: ws → Your WebSocket domain

# 3. Enable proxy (orange cloud)

# 4. Configure cache rules
# Cache static assets: /assets/*
# Bypass cache: /api/*, /ws/*

# 5. Enable SSL/TLS
# Set to "Full (strict)"
```

## 7. Monitoring & Logging

### Sentry (Error Tracking)

```bash
# 1. Create Sentry project
# Visit sentry.io

# 2. Install Sentry SDK
npm install @sentry/react @sentry/node

# 3. Configure in app
# Add VITE_SENTRY_DSN to environment variables

# 4. Test error reporting
```

### LogDNA / DataDog (Logging)

```bash
# 1. Set up log aggregation
# Choose LogDNA, DataDog, or similar

# 2. Configure log shipping
# Use Docker logging driver or SDK

# 3. Set up alerts
# API errors, high latency, etc.
```

### Uptime Monitoring

```bash
# 1. Set up health checks
# GET /api/health
# GET /ws/health

# 2. Configure alerts
# Use UptimeRobot, Pingdom, or StatusCake

# 3. Status page
# Set up status.dreamcatcher.app
```

## 8. CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to AWS
        run: |
          # Your deployment script
          ./scripts/deploy-backend.sh
```

## 9. Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable SQL injection protection
- [ ] Implement XSS protection
- [ ] Use CSP headers
- [ ] Enable HSTS
- [ ] Rotate secrets regularly
- [ ] Set up WAF (CloudFlare, AWS WAF)
- [ ] Enable DDoS protection
- [ ] Implement 2FA for admin accounts
- [ ] Set up backup encryption
- [ ] Configure security headers
- [ ] Run security audits (npm audit)

## 10. Performance Optimization

### CDN Configuration

```bash
# Cache static assets
Cache-Control: public, max-age=31536000, immutable

# API responses
Cache-Control: private, max-age=0, must-revalidate

# Enable compression
gzip, brotli
```

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_dreams_user_status ON dreams(user_id, status);
CREATE INDEX CONCURRENTLY idx_fragments_dream_date ON fragments(dream_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_todos_dream_completed ON todos(dream_id, completed);

-- Enable query plan caching
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';

-- Vacuum regularly
VACUUM ANALYZE;
```

### WebSocket Scaling

```bash
# Use Redis adapter for Socket.io
# Enables horizontal scaling

# Configure sticky sessions in load balancer
# Ensures WebSocket connections stay on same server

# Set up auto-scaling
# Based on CPU/memory/connection count
```

## 11. Backup Strategy

```bash
# Daily database backups
pg_dump dreamcatcher > backup-$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).sql s3://dreamcatcher-backups/

# Retention: 7 daily, 4 weekly, 12 monthly

# Test restore monthly
pg_restore -d dreamcatcher_test backup.sql
```

## 12. Scaling Strategy

### Vertical Scaling (Initial)
- Start: 2 CPU, 4GB RAM
- Scale to: 4 CPU, 8GB RAM as needed

### Horizontal Scaling (Growth)
- API servers: Auto-scale 2-10 instances
- WebSocket servers: 2-5 instances with Redis
- Database: Read replicas for analytics

### Cost Optimization
- Use spot instances for non-critical workloads
- Enable auto-scaling down during off-hours
- Use CDN aggressively
- Optimize database queries
- Cache frequently accessed data

## 13. Domain & SSL

```bash
# 1. Purchase domain
# Use Namecheap, Google Domains, etc.

# 2. Configure DNS
# Point to Vercel and API servers

# 3. SSL Certificate
# Vercel handles SSL automatically
# For API: Use Let's Encrypt

# 4. Subdomain structure
# app.dreamcatcher.com → Frontend
# api.dreamcatcher.com → API
# ws.dreamcatcher.com → WebSocket
# admin.dreamcatcher.com → Admin panel
```

## 14. Go-Live Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] DNS configured and propagated
- [ ] Monitoring enabled
- [ ] Logging configured
- [ ] Backup system tested
- [ ] Error tracking active
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on operations
- [ ] Support channels ready
- [ ] Marketing materials prepared

## 15. Post-Launch

### Week 1
- Monitor error rates closely
- Watch for performance bottlenecks
- Gather user feedback
- Hot-fix critical issues

### Month 1
- Analyze usage patterns
- Optimize based on real data
- Scale resources as needed
- Iterate based on feedback

### Ongoing
- Weekly deployments
- Monthly security updates
- Quarterly infrastructure review
- Annual cost optimization

## Support

For deployment assistance:
- **Email**: ops@dreamcatcher.app
- **Slack**: #deployment channel
- **Docs**: https://docs.dreamcatcher.app/deployment

---

**Remember**: Start small, monitor closely, scale gradually. 🚀
