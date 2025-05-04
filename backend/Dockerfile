FROM node:20

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install

# Copy backend code
COPY . .

# Expose port
EXPOSE 5000


# Start backend server
CMD ["npm", "start"]