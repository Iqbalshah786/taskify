#!/bin/bash

# Health Monitor Script for Task Manager Application
# This script monitors MongoDB container health and restarts it if unhealthy

MONGO_CONTAINER="mongo-container"
CHECK_INTERVAL=30  # Check every 30 seconds
LOG_FILE="health_monitor.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

check_mongo_health() {
    # Check if container is running
    if ! docker ps --filter "name=$MONGO_CONTAINER" --filter "status=running" | grep -q $MONGO_CONTAINER; then
        log_message "ERROR: MongoDB container is not running"
        return 1
    fi

    # Check MongoDB health via docker exec
    if docker exec $MONGO_CONTAINER mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
        log_message "INFO: MongoDB health check passed"
        return 0
    else
        log_message "ERROR: MongoDB health check failed"
        return 1
    fi
}

restart_mongo() {
    log_message "WARNING: Restarting MongoDB container..."
    docker restart $MONGO_CONTAINER
    if [ $? -eq 0 ]; then
        log_message "INFO: MongoDB container restarted successfully"
        # Wait for MongoDB to be ready
        sleep 10
    else
        log_message "ERROR: Failed to restart MongoDB container"
    fi
}

main() {
    log_message "INFO: Starting health monitor for MongoDB container"
    
    while true; do
        if ! check_mongo_health; then
            restart_mongo
        fi
        sleep $CHECK_INTERVAL
    done
}

# Handle script termination
trap 'log_message "INFO: Health monitor stopped"; exit 0' SIGINT SIGTERM

# Start monitoring if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main
fi
