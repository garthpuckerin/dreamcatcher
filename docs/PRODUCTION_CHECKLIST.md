# Production Deployment Checklist

This comprehensive checklist ensures a smooth and secure production deployment of Dreamcatcher.

## Pre-Deployment

### Infrastructure Setup

- [ ] **Server Provisioning**
  - [ ] Provision production server (AWS EC2, DigitalOcean, etc.)
  - [ ] Minimum specs: 4 CPU cores, 8GB RAM, 50GB SSD
  - [ ] Configure server firewall (ports 80, 443, 22)
  - [ ] Set up SSH key-based authentication
  - [ ] Disable root login via SSH

- [ ] **Domain Configuration**
  - [ ] Register domain name
  - [ ] Configure DNS A records pointing to server IP
  - [ ] Configure DNS AAAA records for IPv6 (optional)
  - [ ] Set up subdomain for API (api.yourdomain.com)
  - [ ] Set up subdomain for WebSocket (ws.yourdomain.com)

- [ ] **SSL Certificates**
  - [ ] Install Certbot
  - [ ] Obtain SSL certificates for all domains
  - [ ] Configure automatic certificate renewal
  - [ ] Test certificate renewal process

### Database Setup

- [ ] **PostgreSQL (Supabase)**
  - [ ] Create production Supabase project
  - [ ] Configure database connection pooling
  - [ ] Set up read replicas (optional, for scale)
  - [ ] Enable Point-in-Time Recovery (PITR)
  - [ ] Configure automated backups (daily)
  - [ ] Test backup restoration process
  - [ ] Set up database monitoring

### Cache & Session Store

- [ ] **Redis**
  - [ ] Provision Redis instance (AWS ElastiCache, Redis Cloud)
  - [ ] Enable Redis persistence (AOF + RDB)
  - [ ] Configure maxmemory policy (allkeys-lru)
  - [ ] Set up Redis monitoring
  - [ ] Configure automatic failover (if using cluster)

### Third-Party Services

- [ ] **Authentication & API Keys**
  - [ ] Generate secure JWT secret (256-bit)
  - [ ] Rotate existing development secrets

- [ ] **OpenAI**
  - [ ] Create production OpenAI API key
  - [ ] Set up usage limits and monitoring
  - [ ] Configure rate limiting

- [ ] **Stripe**
  - [ ] Create production Stripe account
  - [ ] Complete business verification
  - [ ] Create products and pricing tiers
  - [ ] Set up webhook endpoints
  - [ ] Test payment flows in test mode
  - [ ] Configure tax calculations
  - [ ] Set up subscription management

- [ ] **OAuth Integrations**
  - [ ] GitHub: Create production OAuth app
  - [ ] Slack: Create production Slack app
  - [ ] Google: Create production OAuth credentials
  - [ ] Configure redirect URLs for production
  - [ ] Test OAuth flows

- [ ] **Email Service**
  - [ ] Set up email provider (SendGrid, AWS SES, Postmark)
  - [ ] Configure SPF, DKIM, DMARC records
  - [ ] Create email templates
  - [ ] Test email delivery
  - [ ] Set up bounce/complaint handling

- [ ] **Storage (S3/Cloudflare R2)**
  - [ ] Create S3 bucket or R2 storage
  - [ ] Configure CORS policies
  - [ ] Set up CDN (CloudFront/Cloudflare)
  - [ ] Configure lifecycle policies for old files
  - [ ] Test file upload/download

### Monitoring & Error Tracking

- [ ] **Sentry**
  - [ ] Create production Sentry project
  - [ ] Configure error alerting rules
  - [ ] Set up performance monitoring
  - [ ] Configure release tracking
  - [ ] Test error reporting

- [ ] **Logging**
  - [ ] Set up centralized logging (LogDNA, Papertrail, CloudWatch)
  - [ ] Configure log retention policies
  - [ ] Set up log alerts for critical errors
  - [ ] Test log aggregation

- [ ] **Uptime Monitoring**
  - [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
  - [ ] Configure health check endpoints
  - [ ] Set up alerting (email, SMS, Slack)
  - [ ] Create status page (optional)

- [ ] **Performance Monitoring**
  - [ ] Set up APM (New Relic, DataDog, optional)
  - [ ] Configure performance baselines
  - [ ] Set up slow query alerts

## Environment Variables

- [ ] Create `.env.production` file with all required variables
- [ ] Verify all environment variables are set correctly
- [ ] Never commit `.env.production` to version control
- [ ] Use strong, unique secrets for production
- [ ] Document all environment variables in `.env.example`

### Required Variables Checklist

- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL`
- [ ] `REDIS_URL`
- [ ] `JWT_SECRET` (256-bit random string)
- [ ] `OPENAI_API_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `SENTRY_DSN`
- [ ] `EMAIL_PROVIDER` credentials
- [ ] All OAuth client IDs and secrets

## Deployment

### Server Preparation

- [ ] Run `./scripts/setup-production.sh` on server
- [ ] Install Docker and Docker Compose
- [ ] Configure system limits (file descriptors, connections)
- [ ] Set up log rotation
- [ ] Configure firewall rules
- [ ] Install monitoring agents

### Application Deployment

- [ ] Clone repository to `/opt/dreamcatcher`
- [ ] Create `.env.production` file
- [ ] Build Docker images
- [ ] Run database migrations
- [ ] Start services with Docker Compose
- [ ] Verify all containers are running
- [ ] Check health endpoints

### Database Migration

- [ ] Backup existing database (if upgrading)
- [ ] Run migration script: `npm run migrate`
- [ ] Verify all tables created successfully
- [ ] Seed initial data (if needed)
- [ ] Test database connectivity

### Frontend Deployment (Vercel)

- [ ] Connect GitHub repository to Vercel
- [ ] Configure environment variables in Vercel dashboard
- [ ] Set up custom domain
- [ ] Configure SSL (automatic with Vercel)
- [ ] Deploy to production
- [ ] Test deployment
- [ ] Set up preview deployments for PRs

### Backend Deployment

- [ ] Build Docker images
- [ ] Push images to registry (optional)
- [ ] Deploy API server
- [ ] Deploy WebSocket server
- [ ] Configure Nginx reverse proxy
- [ ] Test API endpoints
- [ ] Test WebSocket connections

## Security

### Application Security

- [ ] Enable HTTPS only (redirect HTTP to HTTPS)
- [ ] Configure security headers (CSP, HSTS, X-Frame-Options)
- [ ] Enable rate limiting
- [ ] Configure CORS policies
- [ ] Sanitize user inputs
- [ ] Enable SQL injection protection
- [ ] Enable XSS protection
- [ ] Configure session security
- [ ] Enable CSRF protection

### Server Security

- [ ] Keep server OS updated
- [ ] Configure automatic security updates
- [ ] Set up fail2ban for SSH
- [ ] Disable unnecessary services
- [ ] Configure proper file permissions
- [ ] Use non-root user for applications
- [ ] Enable audit logging
- [ ] Configure intrusion detection (optional)

### Secrets Management

- [ ] Never commit secrets to version control
- [ ] Rotate secrets regularly
- [ ] Use environment variables for secrets
- [ ] Consider using secrets manager (AWS Secrets Manager, Vault)
- [ ] Audit secret access

## Testing

### Smoke Tests

- [ ] Test homepage loads
- [ ] Test user registration
- [ ] Test user login
- [ ] Test creating a dream
- [ ] Test AI assistant features
- [ ] Test real-time collaboration
- [ ] Test payment flow
- [ ] Test OAuth integrations
- [ ] Test mobile app connectivity

### Performance Tests

- [ ] Run load tests
- [ ] Test API response times (<200ms)
- [ ] Test database query performance
- [ ] Test WebSocket scalability
- [ ] Test CDN caching
- [ ] Verify gzip compression enabled

### Security Tests

- [ ] Run security scan (OWASP ZAP, Burp Suite)
- [ ] Test SQL injection prevention
- [ ] Test XSS prevention
- [ ] Test CSRF protection
- [ ] Test authentication bypass
- [ ] Test authorization controls
- [ ] Test rate limiting

## Monitoring & Alerts

### Set Up Alerts

- [ ] API server down
- [ ] WebSocket server down
- [ ] Database connection issues
- [ ] Redis connection issues
- [ ] High error rate (>1%)
- [ ] Slow response times (>1s)
- [ ] High CPU usage (>80%)
- [ ] High memory usage (>90%)
- [ ] Disk space low (<10%)
- [ ] SSL certificate expiring (<30 days)

### Dashboards

- [ ] Create uptime dashboard
- [ ] Create performance dashboard
- [ ] Create error rate dashboard
- [ ] Create user activity dashboard
- [ ] Create revenue dashboard

## Documentation

- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures
- [ ] Document rollback procedures
- [ ] Create incident response plan

## Post-Deployment

### Immediate Verification

- [ ] Verify all services are running
- [ ] Check health endpoints
- [ ] Monitor error logs for 1 hour
- [ ] Test critical user flows
- [ ] Verify monitoring is working
- [ ] Check that emails are being sent

### First 24 Hours

- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Watch for unusual traffic patterns
- [ ] Check database performance
- [ ] Verify backups are running
- [ ] Monitor costs

### First Week

- [ ] Review error logs daily
- [ ] Monitor user feedback
- [ ] Check performance trends
- [ ] Verify all integrations working
- [ ] Review security logs
- [ ] Optimize slow queries

## Rollback Plan

### If Deployment Fails

- [ ] Document current state
- [ ] Stop new deployments
- [ ] Restore from backup if needed
- [ ] Rollback to previous version
- [ ] Notify users if necessary
- [ ] Post-mortem analysis

### Rollback Steps

1. Stop current services: `docker-compose down`
2. Checkout previous version: `git checkout <previous-tag>`
3. Restore database: `pg_restore <backup-file>`
4. Start services: `docker-compose up -d`
5. Verify rollback successful
6. Investigate issues

## Compliance & Legal

- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Add cookie consent (if in EU/GDPR applies)
- [ ] Configure data retention policies
- [ ] Set up GDPR compliance tools
- [ ] Add user data export feature
- [ ] Add user account deletion feature

## Scalability Preparation

### When You Grow

- [ ] **Database Scaling**
  - [ ] Set up read replicas
  - [ ] Consider database sharding
  - [ ] Optimize indexes
  - [ ] Enable query caching

- [ ] **Application Scaling**
  - [ ] Set up load balancer
  - [ ] Enable horizontal scaling
  - [ ] Configure auto-scaling
  - [ ] Optimize Docker images

- [ ] **CDN & Caching**
  - [ ] Implement edge caching
  - [ ] Use CloudFlare or similar
  - [ ] Cache static assets aggressively
  - [ ] Implement API response caching

## Budget Considerations

### Monthly Cost Estimates

**Minimum (0-100 users):**
- Server: $20-40
- Database: $25 (Supabase Pro)
- Redis: $15-30
- Email: $15
- Storage: $5-10
- Monitoring: Free tier
- **Total: ~$100-120/month**

**Small Scale (100-1,000 users):**
- Server: $80-120
- Database: $25-50
- Redis: $30-50
- Email: $25
- Storage: $20-30
- Monitoring: $30-50
- **Total: ~$210-325/month**

**Medium Scale (1,000-10,000 users):**
- Server: $200-400
- Database: $100-200
- Redis: $100-150
- Email: $50-100
- Storage: $50-100
- Monitoring: $100
- CDN: $50-100
- **Total: ~$650-1,150/month**

## Launch Day Checklist

- [ ] All monitoring is active
- [ ] All alerts are configured
- [ ] Team is on standby
- [ ] Rollback plan is ready
- [ ] Backup is verified
- [ ] Performance baselines are set
- [ ] Support email is monitored
- [ ] Social media is ready
- [ ] Press release (if applicable)
- [ ] Marketing campaigns ready

---

## Quick Commands Reference

```bash
# Deploy to production
./scripts/deploy.sh production

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# View API logs
docker-compose logs -f api

# View WebSocket logs
docker-compose logs -f websocket

# Restart services
docker-compose restart

# Run migrations
docker-compose exec api npm run migrate

# Access database
docker-compose exec postgres psql -U dreamcatcher

# Access Redis
docker-compose exec redis redis-cli

# Health checks
curl https://yourdomain.com/health
curl https://api.yourdomain.com/health
curl https://ws.yourdomain.com/health
```

---

**Remember:** Production is not a destination, it's a journey. Keep monitoring, keep improving, and keep your users happy! 🚀
