FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

ENV PORT 4000

EXPOSE $PORT

VOLUME [ "/app/dataUsers" ]

CMD ["node", "index.js"]