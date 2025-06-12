# Manual Docker Commands for Task Manager

This document provides the manual Docker commands required by the assignment to run the application without Docker Compose.

## Step 1: Create Custom Network

```bash
docker network create app-network
```

## Step 2: Build Docker Images

```bash
# Build the Next.js application image
docker build -t task-manager-app .

# MongoDB uses official image, no build needed
```

## Step 3: Create Volume for MongoDB

```bash
docker volume create mongo-data
```

## Step 4: Run MongoDB Container

```bash
docker run -d \
  --name mongo-container \
  --network app-network \
  -v mongo-data:/data/db \
  -p 27017:27017 \
  mongo:7.0
```

## Step 5: Run the Application Container

```bash
# Set environment variables
export GOOGLE_GEMINI_API=your_api_key_here

# Run the application
docker run -d \
  --name app-container \
  --network app-network \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongo-container:27017/mytodoapp \
  -e GOOGLE_GEMINI_API=${GOOGLE_GEMINI_API} \
  task-manager-app
```

## Step 6: Verify Application

```bash
# Check running containers
docker ps

# Check application logs
docker logs app-container

# Check MongoDB logs
docker logs mongo-container

# Access the application
curl http://localhost:3000/api/todos
```

## Step 7: Health Checks

```bash
# Check container health
docker inspect app-container --format='{{.State.Health.Status}}'
docker inspect mongo-container --format='{{.State.Health.Status}}'
```

## Cleanup Commands

```bash
# Stop containers
docker stop app-container mongo-container

# Remove containers
docker rm app-container mongo-container

# Remove network
docker network rm app-network

# Remove volume (optional - removes data)
docker volume rm mongo-data

# Remove image
docker rmi task-manager-app
```

## Alternative: Quick Setup Script

For convenience, you can also use this one-liner to start everything:

```bash
# Create network and volume
docker network create app-network
docker volume create mongo-data

# Start MongoDB
docker run -d --name mongo-container --network app-network -v mongo-data:/data/db -p 27017:27017 mongo:7.0

# Wait for MongoDB to start
sleep 10

# Build and run app
docker build -t task-manager-app .
docker run -d --name app-container --network app-network -p 3000:3000 -e MONGODB_URI=mongodb://mongo-container:27017/mytodoapp -e GOOGLE_GEMINI_API=${GOOGLE_GEMINI_API} task-manager-app
```

## Troubleshooting

1. **Port conflicts**: If ports 3000 or 27017 are in use, stop existing services or use different ports
2. **Network issues**: Ensure containers are on the same network (`app-network`)
3. **Environment variables**: Make sure `GOOGLE_GEMINI_API` is set before running
4. **Container logs**: Use `docker logs <container-name>` to debug issues
