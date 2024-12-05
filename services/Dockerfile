FROM node:20

WORKDIR /app

COPY *.json ./

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 4002

CMD ["node", "dist/index.js"]