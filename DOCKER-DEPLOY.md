# Docker Deployment Guide

## 🐳 Deploy CashCraft with Docker

This guide shows you how to deploy CashCraft using Docker and Docker Compose.

---

## Prerequisites

1. **Install Docker & Docker Compose**
   - [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows/Mac)
   - Or Docker Engine + Docker Compose (Linux)

2. **Domain name** (optional, can use IP address)

3. **Server/VPS** with:
   - 2GB RAM minimum
   - 20GB storage
   - Ubuntu 22.04 or similar

---

## Quick Start (Local Testing)

```bash
# 1. Clone your repository
git clone https://github.com/yourusername/cashcraft.git
cd cashcraft

# 2. Create environment file
cp .env.docker .env

# 3. Edit .env and add your secrets
nano .env

# 4. Generate JWT secret
openssl rand -base64 32

# 5. Start all services
docker-compose up -d

# 6. Check status
docker-compose ps

# 7. View logs
docker-compose logs -f

# 8. Access your app
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432
```

---

## Production Deployment

### Option 1: Deploy to VPS (DigitalOcean, Linode, AWS EC2)

#### Step 1: Set up VPS

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Create app directory
mkdir -p /opt/cashcraft
cd /opt/cashcraft
```

#### Step 2: Upload Files

```bash
# On your local machine
scp -r * root@your-server-ip:/opt/cashcraft/

# Or use Git
ssh root@your-server-ip
cd /opt/cashcraft
git clone https://github.com/yourusername/cashcraft.git .
```

#### Step 3: Configure Environment

```bash
# Create .env file
nano .env

# Add your configuration:
DB_PASSWORD=your_secure_password_here
JWT_SECRET_KEY=your_jwt_secret_32_chars_minimum
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CLIENT_ID=your_google_client_id
```

#### Step 4: Update nginx.conf

```bash
nano nginx.conf

# Replace 'yourdomain.com' with your actual domain
# If using IP, replace with your server IP
```

#### Step 5: Set up SSL (Let's Encrypt)

```bash
# Install Certbot
apt install certbot -y

# Get SSL certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Create SSL directory
mkdir -p ssl

# Copy certificates
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/
```

#### Step 6: Deploy

```bash
# Build and start services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Test health
curl http://localhost:5000/health
```

#### Step 7: Run Database Migrations

```bash
# Enter backend container
docker exec -it cashcraft-backend bash

# Run migrations
dotnet ef database update

# Exit container
exit
```

#### Step 8: Create Admin User

```bash
# Call admin creation endpoint
curl -X POST http://localhost:5000/api/admin/create-admin
```

---

### Option 2: Deploy to Cloud Platforms

#### **DigitalOcean App Platform**

1. Create new app from GitHub
2. Add Docker Compose configuration
3. Set environment variables
4. Deploy

#### **AWS ECS (Elastic Container Service)**

1. Push images to ECR
2. Create ECS cluster
3. Define task definitions
4. Create services
5. Configure load balancer

#### **Google Cloud Run**

```bash
# Build and push images
docker build -t gcr.io/your-project/cashcraft-frontend .
docker push gcr.io/your-project/cashcraft-frontend

docker build -t gcr.io/your-project/cashcraft-backend ./backend/CashCraft.Api
docker push gcr.io/your-project/cashcraft-backend

# Deploy
gcloud run deploy cashcraft-frontend --image gcr.io/your-project/cashcraft-frontend
gcloud run deploy cashcraft-backend --image gcr.io/your-project/cashcraft-backend
```

---

## Docker Commands Cheat Sheet

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f [service-name]

# View running containers
docker-compose ps

# Execute command in container
docker exec -it cashcraft-backend bash

# Rebuild and restart
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v

# View resource usage
docker stats

# Clean up unused images
docker system prune -a
```

---

## Monitoring & Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Database Backup

```bash
# Backup database
docker exec cashcraft-db pg_dump -U cashcraft_user cashcraft > backup_$(date +%Y%m%d).sql

# Restore database
docker exec -i cashcraft-db psql -U cashcraft_user cashcraft < backup_20240101.sql
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or rebuild specific service
docker-compose up -d --build frontend
```

---

## Scaling

### Scale Services

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Scale frontend to 2 instances
docker-compose up -d --scale frontend=2
```

### Add Load Balancer

Update `docker-compose.yml` to add HAProxy or use cloud load balancer.

---

## Security Best Practices

1. **Use secrets management**
   ```bash
   # Use Docker secrets instead of environment variables
   docker secret create jwt_secret jwt_secret.txt
   ```

2. **Regular updates**
   ```bash
   # Update base images
   docker-compose pull
   docker-compose up -d
   ```

3. **Firewall configuration**
   ```bash
   # Allow only necessary ports
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 22/tcp
   ufw enable
   ```

4. **SSL/TLS**
   - Always use HTTPS in production
   - Auto-renew Let's Encrypt certificates

5. **Database security**
   - Use strong passwords
   - Don't expose database port publicly
   - Regular backups

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs [service-name]

# Check container status
docker ps -a

# Inspect container
docker inspect cashcraft-backend
```

### Database connection issues

```bash
# Check database is running
docker-compose ps database

# Test connection
docker exec -it cashcraft-db psql -U cashcraft_user -d cashcraft

# Check connection string in backend
docker exec cashcraft-backend env | grep ConnectionStrings
```

### Port conflicts

```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000

# Change ports in docker-compose.yml
ports:
  - "8080:3000"  # Use 8080 instead of 3000
```

### Out of memory

```bash
# Check memory usage
docker stats

# Add memory limits in docker-compose.yml
services:
  backend:
    mem_limit: 512m
```

---

## Cost Estimate

### VPS Hosting (DigitalOcean/Linode)
- **Basic Droplet**: $6/month (1GB RAM)
- **Recommended**: $12/month (2GB RAM)
- **Production**: $24/month (4GB RAM)

### Cloud Platforms
- **AWS ECS**: ~$20-50/month
- **Google Cloud Run**: Pay per use (~$10-30/month)
- **Azure Container Instances**: ~$15-40/month

---

## Performance Optimization

1. **Enable caching**
   - Add Redis container
   - Cache API responses

2. **Use CDN**
   - CloudFlare (free)
   - AWS CloudFront

3. **Optimize images**
   - Use multi-stage builds
   - Minimize layer size

4. **Database optimization**
   - Add indexes
   - Connection pooling
   - Query optimization

---

## Next Steps

1. ✅ Deploy with Docker
2. ✅ Set up SSL/HTTPS
3. ✅ Configure domain
4. ✅ Set up monitoring
5. ✅ Configure backups
6. ✅ Set up CI/CD
7. ✅ Load testing
8. ✅ Documentation

---

## Support

For issues:
- Check logs: `docker-compose logs -f`
- Verify environment variables
- Test database connectivity
- Check firewall rules

Good luck with your Docker deployment! 🐳🚀
