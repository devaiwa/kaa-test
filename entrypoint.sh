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

# Execute the command in the target container
docker cp /usr/local/bin/Modelfile $CONTAINER_ID:/usr/local/bin/Modelfile$BUILD_TIMESTAMP
docker exec -i $CONTAINER_ID pwd
docker exec -i $CONTAINER_ID "ls -la"
docker exec -i "$CONTAINER_ID" "ollama create KAA-Train-$BUILD_TIMESTAMP -f /usr/local/bin/Modelfile$BUILD_TIMESTAMP"
echo "Model created naujas"
