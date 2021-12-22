FROM node:16-alpine3.12

# Build
ADD . /app
WORKDIR /app

RUN yarn install

EXPOSE 3000

CMD ["npm", "start"]
