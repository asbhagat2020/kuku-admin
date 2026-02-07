FROM node:20

RUN mkdir -p /usr/src

WORKDIR /usr/src

COPY . /usr/src

RUN npm install -f

RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]
