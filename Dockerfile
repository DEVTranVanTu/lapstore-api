FROM node:16-alpine

EXPOSE 5555

WORKDIR /app

RUN npm i npm@latest -g

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/server.js"]