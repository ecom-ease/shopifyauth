FROM node:18

WORKDIR /app
COPY . .

RUN npm install

ENV NODE_ENV=production

CMD ["node", "index.js"]
