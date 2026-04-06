# syntax=docker/dockerfile:1
# https://docs.docker.com/reference/dockerfile/

# Install Node
FROM node:24-slim
WORKDIR /usr/src/app
COPY . .

# Install Dependencies and Build
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Setup Production Build
RUN pnpm install --frozen-lockfile --prod
ENV NODE_ENV=production

# Run
ENTRYPOINT [ "node", ".", "--IN_DOCKER" ]
