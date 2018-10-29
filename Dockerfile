FROM node:8-alpine

WORKDIR /app

RUN adduser -D octocat && \
    chown octocat:octocat /app
USER octocat

# With this npm install will only ever be run when building if the application's package.json changes!
COPY --chown=octocat:octocat package.json /app

# The latest offical nodejs image already includes yarn.
RUN yarn install --production --pure-lockfile

COPY --chown=octocat:octocat . /app

EXPOSE 5000

ENTRYPOINT ["yarn", "start"]
