# syntax=docker/dockerfile:1
# https://docs.docker.com/reference/dockerfile/

# Install Node
FROM node:24-slim
WORKDIR /usr/src/app
COPY . .

# Install Dependencies and Build
RUN npm ci
RUN npm run build

# Setup Production Build
RUN npm ci --omit=dev
ENV NODE_ENV=production

# Run
USER node
ENTRYPOINT [ "node", "." ]
