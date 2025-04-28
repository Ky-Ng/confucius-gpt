##############################
# Stage 1) Build Dependencies
##############################
FROM node:23-slim as deps

WORKDIR /app
    
# Copies package.json and package-lock.json
COPY package*.json .

# Signal Production mode (security/performance) to next and react

# Adds all the dependencies in package.json into current build
RUN npm ci 

##############################
# Stage 2) Build Next.js app
##############################
FROM node:23-slim as builder

WORKDIR /app

# Copy the dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source files into this workdir
COPY . . 

# Create the Next app from source
RUN npm run build

##############################
# Stage 3) Production Image
##############################
FROM node:23-slim as runner
WORKDIR /app

# Copy over the minimimum files needed for deployment

# Contains next configurations like environment vars
COPY --from=builder /app/next.config.ts ./ 

# Contains static files like favicon
COPY --from=builder /app/public ./public

# Contains compiled production files from npm run build
COPY --from=builder /app/.next ./.next

# Contains dependencies (Next, React, etc)
COPY --from=builder /app/node_modules ./node_modules

# NextJS needs this at runtime
COPY --from=builder /app/package.json ./package.json

EXPOSE 8080

ENV NODE_ENV=production

CMD [ "npm", "run", "start" ]