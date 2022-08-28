FROM node:14


LABEL version="1.0"


WORKDIR /usr/src


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000/tcp
EXPOSE 4000/udp
CMD ["npm", "start"]