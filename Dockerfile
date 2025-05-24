FROM node:18

WORKDIR /app
COPY . .

RUN npm install

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "index.js"]
