# Frogtoberfest Checker

[![Build Status](https://travis-ci.org/jenkoian/hacktoberfest-checker.svg?branch=master)](https://travis-ci.org/jenkoian/hacktoberfest-checker)
![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)

Useful checker web app to see how close you are to achieving the requirements for a free swag as part of Frogtoberfest.

Happy hacking!

[https://frogtoberfest.lftechnology.com/](https://frogtoberfest.lftechnology.com/)
([https://frogtoberfest.lftechnology.com/](https://frogtoberfest.lftechnology.com/))

![Screenshot](frogtoberfest-checker.png)

## Requirements

* Node v8+

> Recommended to use [NVM](https://github.com/creationix/nvm)

## Running the app

* [Generate a GitHub personal access token](https://github.com/settings/tokens/new?scopes=&description=Hacktoberfest%20Checker) to ensure you don't get rate limited as often.

* Create a `.env` file using `.env.example` as an example. Or export the GitHub token as an environment variable for Node.js to use:
   * Mac/Linux: `export GITHUB_TOKEN=YOUR_TOKEN`
   * Windows (cmd.exe): `set GITHUB_TOKEN=YOUR TOKEN`
   * Windows (PowerShell): `$env:GITHUB_TOKEN=YOUR TOKEN`

* `$ yarn install`

* `$ yarn start`

* Point browser to [localhost:5000](http://localhost:5000)

Want to run the API server and the frontend in their own processes? Use this:
```bash
$ yarn start-frontend
$ yarn start-server
```

### Running the app within Docker

As an alternative to the section above, you can run the app within a Docker container:

* `$ docker build -t hacktoberfest-checker .`

* `$ docker run -p 5000:5000 -e "GITHUB_TOKEN=YOUR_TOKEN" hacktoberfest-checker`

or use the docker-compose

* `$ docker-compose up --build`

## License

MIT © 2015-2018 [Ian Jenkins](https://github.com/jenkoian)
