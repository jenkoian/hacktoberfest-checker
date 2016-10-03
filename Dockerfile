FROM node:6

WORKDIR /app
COPY . /app

RUN useradd -ms /bin/bash octocat
RUN chown octocat:octocat /app
USER octocat

RUN npm install

EXPOSE 5000

ENTRYPOINT ["node", "index.js"]