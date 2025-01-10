# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /frontend

# Install dependencies and build the frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Set up the backend
FROM node:18-alpine

WORKDIR /backend

# Install backend dependencies
COPY backend/package.json backend/package-lock.json ./
COPY backend/prisma ./prisma/
RUN npm install

# Copy backend code
COPY backend/ ./
RUN npm run build


# Copy the service-account.json file to the correct location
COPY backend/src/configs/service-account.json ./dist/configs/service-account.json

# Copy frontend build into backend's public folder
COPY --from=frontend-builder /frontend/dist ./dist/public

# Expose the backend port
EXPOSE 8080

# Start the backend server
CMD ["npm", "run", "start"]
