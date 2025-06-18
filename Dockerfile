# Use the official Bun image
FROM oven/bun:alpine

# Set the working directory to the root (default is already /)
WORKDIR /

# Copy everything into the container
COPY . .

# Install dependencies if needed (optional)
RUN if [ -f bun.lockb ]; then bun install; fi

# Expose the default port (optional, e.g., 3000)
EXPOSE 3000

# Run the server
CMD ["bun", "server.js"]