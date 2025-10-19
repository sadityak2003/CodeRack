# Step 1: Build the Next.js app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Step 2: Run the production build
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy TypeScript Next config
COPY --from=builder /app/next.config.ts ./

# Expose the port Cloud Run will use
EXPOSE 8080
ENV PORT=8080

# Start the Next.js server
CMD ["npm", "start"]
