# Use the official Bun image
FROM oven/bun:canary AS base
WORKDIR /usr/src/app

# Install Python and other build dependencies
RUN apt-get update && apt-get install -y python3 build-essential liblzma-dev

# Install dependencies into a temp directory
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --production --frozen-lockfile

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
# RUN bun test
RUN bun run build

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
USER bun
EXPOSE 5173/tcp
ENTRYPOINT [ "bun", "run", "build/index.js" ]