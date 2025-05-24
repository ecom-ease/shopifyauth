FROM node:18

WORKDIR /app
COPY . .

RUN npm install

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "index.js"]