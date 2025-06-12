# Docker Setup Guide for Task Manager

This guide explains how to run your Task Manager application using Docker in different configurations.

## Option 1: Full Docker Setup (Recommended for Production)

This runs both the application and MongoDB in Docker containers.

### Prerequisites

- Docker Desktop installed and running
- Google Gemini API key

### Steps

1. **Build and start all services:**

```bash
# Set your API key
export GOOGLE_GEMINI_API=your_api_key_here

# Start all services
docker compose up --build
```

2. **Access the application:**

   - Application: http://localhost:3000
   - MongoDB: localhost:27017

3. **Stop the services:**

```bash
docker compose down
```

4. **Clean up (removes data):**

```bash
docker compose down -v
```

## Option 2: Hybrid Setup (Recommended for Development)

This runs MongoDB in Docker and the Next.js app locally with pnpm.

### Prerequisites

- Docker Desktop installed and running
- Node.js 18+ and pnpm installed
- Google Gemini API key

### Steps

1. **Start MongoDB in Docker:**

```bash
docker run -d --name task-manager-mongo -p 27017:27017 mongo:latest
```

2. **Update .env.local:**

```env
MONGODB_URI=mongodb://localhost:27017/mytodoapp
GOOGLE_GEMINI_API=your_api_key_here
```

3. **Install dependencies and start the app:**

```bash
pnpm install
pnpm dev
```

4. **Access the application:**

   - Application: http://localhost:3000
   - MongoDB: localhost:27017

5. **Stop MongoDB when done:**

```bash
docker stop task-manager-mongo
docker rm task-manager-mongo
```

## Option 3: Local Development (No Docker)

Run everything locally without Docker.

### Prerequisites

- MongoDB installed locally
- Node.js 18+ and pnpm installed
- Google Gemini API key

### Steps

1. **Start MongoDB locally:**

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

2. **Update .env.local:**

```env
MONGODB_URI=mongodb://localhost:27017/mytodoapp
GOOGLE_GEMINI_API=your_api_key_here
```

3. **Install dependencies and start the app:**

```bash
pnpm install
pnpm dev
```

## Troubleshooting

### Docker Issues

1. **"docker-credential-desktop" not found:**

   - This is a common macOS issue
   - Solution: Use Option 2 (Hybrid Setup) instead

2. **Port 27017 already in use:**

   - Stop any existing MongoDB instances:

   ```bash
   brew services stop mongodb-community
   # or
   docker stop $(docker ps -q --filter "expose=27017")
   ```

3. **Permission denied errors:**
   - Ensure Docker Desktop is running
   - Try restarting Docker Desktop

### Application Issues

1. **MongoDB connection errors:**

   - Verify MongoDB is running: `docker ps` or `brew services list`
   - Check the MONGODB_URI in .env.local
   - Ensure the port 27017 is not blocked

2. **AI suggestions not working:**
   - Verify Google Gemini API key is correct
   - Check API quota and permissions
   - Look for errors in browser console

### Performance Tips

1. **For development:** Use Option 2 (Hybrid Setup)
2. **For production:** Use Option 1 (Full Docker)
3. **For testing:** Use Option 3 (Local Development)

## Environment Variables

| Variable            | Description               | Required |
| ------------------- | ------------------------- | -------- |
| `MONGODB_URI`       | MongoDB connection string | Yes      |
| `GOOGLE_GEMINI_API` | Google Gemini API key     | Yes      |

## Docker Commands Reference

```bash
# View running containers
docker ps

# View logs
docker logs task-manager-mongo
docker compose logs app

# Access MongoDB shell
docker exec -it task-manager-mongo mongosh

# Clean up all Docker resources
docker system prune

# Rebuild without cache
docker compose build --no-cache
```
