FROM node:14.18.1-alpine AS builder

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY babel.*.js ./
COPY tsconfig*.json ./

RUN yarn

COPY ./src ./src

RUN yarn build

FROM node:14.18.1-alpine

WORKDIR /usr/app

ENV NODE_ENV=production

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --production

## We just need the build to execute the command
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["yarn","start"]