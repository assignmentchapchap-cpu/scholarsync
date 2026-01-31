
FROM node:24.13-alpine

# Install helpful tools
RUN apk add --no-cache git libc6-compat

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package management files to leverage cache
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* turbo.json ./

# Copy the rest of the code
COPY . .

# Install dependencies
RUN pnpm install

# Expose Next.js default port
EXPOSE 3000

# Default command
CMD ["pnpm", "dev"]
