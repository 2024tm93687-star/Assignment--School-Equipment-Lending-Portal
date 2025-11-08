# -------- Build stage --------
FROM node:20-alpine3.18 AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# -------- Runtime stage --------
FROM node:20-alpine3.18
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --only=production

# Copy source code and scripts
COPY --from=build /app/src ./src
COPY --from=build /app/Models ./Models
COPY --from=build /app/src/scripts ./src/scripts
COPY --from=build /app/src/utils ./src/utils

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the port the app runs on
EXPOSE 3010

# Command to run the application
CMD ["node", "src/index.js"]
