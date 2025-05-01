FROM node:20

WORKDIR /app

# Install frontend dependencies
COPY package*.json ./
RUN npm install

# Copy frontend code
COPY . .

# Build React app
RUN npm run build

# Install 'serve' to serve production build
RUN npm install -g serve

EXPOSE 3000

# Serve build folder
CMD ["serve", "-s", "build", "-l", "3000"]
