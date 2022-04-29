FROM node:12
ENV NODE_ENV=production
WORKDIR /usr/src/server
COPY ["package.json", "./"]
RUN yarn --production
COPY . .
EXPOSE 5000
CMD ["yarn", "start"]
