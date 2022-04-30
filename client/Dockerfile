FROM node:14
WORKDIR /usr/src/client
COPY ["package.json", "./"]
RUN yarn
COPY . .
EXPOSE 3000
RUN yarn build
CMD ["serve", "-s", "build"]