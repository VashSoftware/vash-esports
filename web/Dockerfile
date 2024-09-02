# Use the official Node.js image
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# Install Python and other build dependencies
RUN apk add --no-cache python3 make g++ libc6-compat

# Install dependencies into a temp directory
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json package-lock.json* /temp/dev/
RUN cd /temp/dev && npm ci

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json package-lock.json* /temp/prod/
RUN cd /temp/prod && npm ci --only=production

# Copy node_modules from the temp directory
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Set environment variables for the build process
ENV PUBLIC_OSU_CLIENT_ID=${OSU_CLIENT_ID}
ENV OSU_CLIENT_SECRET=${OSU_CLIENT_SECRET}
ENV PUBLIC_SUPABASE_URL=${SUPABASE_URL}
ENV PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_SERVICE_KEY}
ENV JWT_SECRET=${JWT_SECRET}
ENV PUBLIC_DISCORD_CLIENT_ID=${DISCORD_APPLICATION_ID}
ENV DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}

# [Optional] Tests & build
# RUN npm test
RUN npm run build

# Copy production dependencies and source code into the final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build build
COPY --from=prerelease /usr/src/app/package.json .

# Set environment variables for the runtime process
ENV PUBLIC_OSU_CLIENT_ID=${OSU_CLIENT_ID}
ENV OSU_CLIENT_SECRET=${OSU_CLIENT_SECRET}
ENV PUBLIC_SUPABASE_URL=${SUPABASE_URL}
ENV PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_SERVICE_KEY}
ENV JWT_SECRET=${JWT_SECRET}
ENV PUBLIC_DISCORD_CLIENT_ID=${DISCORD_APPLICATION_ID}
ENV DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}

# Run the app
USER node
EXPOSE 5173
CMD [ "node", "build/index.js" ]