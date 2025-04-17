#!/bin/bash

# Check if the target container name and command are provided as arguments
# if [ $# -lt 2 ]; then
#   echo "Usage: $0 <target_container_name> <command_to_execute>"
#   exit 1
# fi

TARGET_CONTAINER_NAME="ollama-api-xkcck04cwo0g8ocog8cswwkg"
#COMMAND_TO_EXECUTE="$2"

# Get the container ID
CONTAINER_ID=$(docker ps -a -qf "name=$TARGET_CONTAINER_NAME")

if [ -z "$CONTAINER_ID" ]; then
  echo "Error: Container '$TARGET_CONTAINER_NAME' not found."
  exit 1
fi

export BUILD_TIMESTAMP="$(cat /build-timestamp)"

#Rename Modelfile
pwd
ls -la
pwd

# Execute the command in the target container
#ls -la /usr/local/bin
# This script checks if the container is started for the first time.

CONTAINER_FIRST_STARTUP="CONTAINER_FIRST_STARTUP"
if [ ! -e /$CONTAINER_FIRST_STARTUP ]; then
    touch /$CONTAINER_FIRST_STARTUP
    docker cp /usr/local/bin/Modelfile $CONTAINER_ID:/Modelfile
    docker exec -i $CONTAINER_ID "pwd"
    #docker exec -i $CONTAINER_ID "ollama list"
    docker exec -i $CONTAINER_ID sh 
    ls -la
    exit 
    #docker exec -i "$CONTAINER_ID" "ollama create kaa-train$BUILD_TIMESTAMP -f /Modelfile$BUILD_TIMESTAMP"

    echo "First run"
else
    # script that should run the rest of the times (instances where you 
    echo "running"
fi
