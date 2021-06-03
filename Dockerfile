FROM node:alpine

WORKDIR /

COPY . .
RUN npm install
RUN npm run build
COPY src src

EXPOSE 3000

CMD [ "npm", "run", "start:docker" ]