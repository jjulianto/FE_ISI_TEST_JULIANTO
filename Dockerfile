FROM node:20-alpine

# Create app directory
WORKDIR /app

# Bundle files
COPY . .

#Update npm 
RUN npm install -g npm@latest

# Install dependencies
RUN npm ci

# Expose port 3000
EXPOSE 3000

CMD ["npm", "run", "dev"]