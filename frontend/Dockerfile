# Stage 1: Build the React app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build the app
COPY . .
RUN npm run build

# Stage 2: Use Nginx to serve the built app
FROM nginx:alpine

# Remove the default nginx.conf to avoid conflict (optional but clean)
RUN rm /etc/nginx/conf.d/default.conf

# Copy built React files
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config (important!)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for frontend
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
