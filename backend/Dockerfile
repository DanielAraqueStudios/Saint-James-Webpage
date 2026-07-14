FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN cp -r src/db/migrations dist/db/migrations

RUN mkdir -p uploads

EXPOSE 8080

CMD ["npm", "run", "start"]
