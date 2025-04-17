FROM ubuntu:latest

# Install necessary tools for inter-container communication and execution
RUN apt-get update && apt-get install -y \
    docker.io \
    curl \
    jq \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set up a script to execute commands in the target container
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

#Run date 
RUN date +_%m_%d_%H_%M > /build-timestamp

COPY Modelfile /usr/local/bin/Modelfile

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

