FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "node_modules/.bin/next start -p ${PORT:-3001}"]
