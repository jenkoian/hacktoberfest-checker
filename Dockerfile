FROM node:6

WORKDIR /app

RUN useradd -ms /bin/bash octocat
RUN chown octocat:octocat /app
USER octocat

# With this npm install will only ever be run when building if the application's package.json changes!
COPY package.json /app
# Copy bower.json as well otherwise post install will fail
COPY bower.json /app

RUN npm install --production

COPY . /app

EXPOSE 5000

ENTRYPOINT ["node", "index.js"]
