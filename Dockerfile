FROM node:6

WORKDIR /app

RUN useradd -ms /bin/bash octocat
RUN chown octocat:octocat /app
USER octocat

# With this npm install will only ever be run when building if the application's package.json changes!
COPY package.json /app

RUN npm install -g yarn && yarn install --production

COPY . /app

EXPOSE 5000

ENTRYPOINT ["node", "index.js"]
