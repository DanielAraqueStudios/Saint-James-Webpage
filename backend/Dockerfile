FROM node:20-alpine

# ffmpeg powers server-side trimming of uploaded tracks (POST /api/tracks
# with trim_start/trim_end).
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN cp -r src/db/migrations dist/db/migrations

RUN mkdir -p uploads

EXPOSE 8080

CMD ["npm", "run", "start"]
