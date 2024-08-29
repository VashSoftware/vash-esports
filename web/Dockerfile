# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:18 AS runtime

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=builder /usr/src/app/build /usr/src/app/build
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Install Vite globally to serve the app
RUN npm install -g vite

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["vite", "preview", "--port", "3000"]