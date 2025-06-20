# Use the official Node.js image
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the default port (optional, e.g., 3000)
EXPOSE 3000

# Run the server
CMD ["node", "server.js"]