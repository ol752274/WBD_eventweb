FROM node:20

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install

# Copy backend code
COPY . .

# Expose port
EXPOSE 5000

ENV SOLR_HOST=solr  # Matches the service name in docker-compose
ENV SOLR_PORT=8983

# Start backend server
CMD ["npm", "start"]
