# Stage 1: Build the Next.js application

# Use an official Node.js runtime as a parent image
FROM node:16-alpine AS ROOT_IMAGE

# Create the working directory
RUN mkdir -p /usr/next-store

# Set the working directory
WORKDIR /usr/next-store

# Copy the rest of the application code to the working directory
COPY . .

# Install app dependencies using Yarn
RUN yarn install --network-timeout 1000000

# Build the Next.js application
RUN yarn build

# Install only the production dependencies specified in your project's package.json file, excluding development dependencies
# So that only the necessary packages are installed for running the application in a production setting.
# Which can help reduce the size of your node_modules folder and potentially improve deployment and runtime performance
RUN rm -rf node_modules
RUN yarn install --production

# Optimizing the build using multi-stage Docker builds:

# Stage 2: Create a minimal runtime image

# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set a env variable
ENV NODE_ENV production

# Create the working directory
RUN mkdir -p /usr/next-store

# Set the working directory
WORKDIR /usr/next-store

# Copy the main files of the build image ("ROOT_IMAGE") to the working directory
COPY --from=ROOT_IMAGE /usr/next-store/node_modules ./node_modules
COPY --from=ROOT_IMAGE /usr/next-store/package.json ./
COPY --from=ROOT_IMAGE /usr/next-store/yarn.lock ./
COPY --from=ROOT_IMAGE /usr/next-store/public ./public
COPY --from=ROOT_IMAGE /usr/next-store/.next ./.next
COPY --from=ROOT_IMAGE /usr/next-store/next.config.js ./next.config.js
COPY --from=ROOT_IMAGE /usr/next-store/next-i18next.config.js ./next-i18next.config.js

# Expose the port that the Next.js app will run on
EXPOSE 3000

# Define the command to start your Next.js app
CMD ["yarn", "start"]