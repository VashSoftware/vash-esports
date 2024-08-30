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

# Set environment variables for the build process
ARG PUBLIC_OSU_CLIENT_ID
ARG OSU_CLIENT_SECRET
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_ANON_KEY
ARG JWT_SECRET
ARG PUBLIC_DISCORD_CLIENT_ID
ARG DISCORD_CLIENT_SECRET

ENV PUBLIC_OSU_CLIENT_ID=${PUBLIC_OSU_CLIENT_ID}
ENV OSU_CLIENT_SECRET=${OSU_CLIENT_SECRET}
ENV PUBLIC_SUPABASE_URL=${PUBLIC_SUPABASE_URL}
ENV PUBLIC_SUPABASE_ANON_KEY=${PUBLIC_SUPABASE_ANON_KEY}
ENV JWT_SECRET=${JWT_SECRET}
ENV PUBLIC_DISCORD_CLIENT_ID=${PUBLIC_DISCORD_CLIENT_ID}
ENV DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}

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

# Use a lightweight server to serve the built files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the application using a static file server
CMD ["serve", "-s", "build", "-l", "3000"]