# Use Node.js 20 base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose port 5000 (should match your app's server port)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
