# Hacktoberfest Checker

[![Build Status](https://img.shields.io/github/workflow/status/jenkoian/hacktoberfest-checker/Build?logo=github)](https://github.com/jenkoian/hacktoberfest-checker/actions?query=workflow%3ABuild)
![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)

Useful checker web app to see how close you are to achieving the requirements for a free t-shirt as part of [Hacktoberfest](https://hacktoberfest.digitalocean.com/).

[https://hacktoberfestchecker.jenko.me/](https://hacktoberfestchecker.jenko.me/)

![Screenshot](hacktoberfest-checker-2020.png)

## 2021!

Again I've left this until the last minute, which is why the site (and screenshot above) look the same as last year! ([help me fix that!](https://github.com/jenkoian/hacktoberfest-checker/issues/566))

The big news this year is gitlab support! Which makes this app a bit tricky. I've added support for gitlab but as we only have one input it only accounts for both if the username matches. This should cover any accounts who work mostly in github _or_ gitlab exclusively or use the same username everywhere but for those people who work across both _and_ have different usernames on both, at the time of writing this app doesn't fully support you :scream:.

I'm trying to think of a nice way to support this use case, perhaps support for some special input format or something? e.g. `jenkoian|ianjenko` so if someone were to submit something like that we would use `jenkoian` for github and `ianjenko` for gitlab. Not sure, needs more thought but hopefully will get solved before October is out!

### Doesn't DigitalOcean have their progress checker now?

They do! However, I still think it's worth having a checker that doesn't require auth and allows you to check on your mates (or celebrity developers!).

Happy hacking!

## Requirements

- Node v10+
  > Recommended to use [NVM](https://github.com/creationix/nvm)

## Running the app

- [Generate a GitHub personal access token](https://github.com/settings/tokens/new?scopes=&description=Hacktoberfest%20Checker) to ensure you don't get rate limited as often.

- [Generate a Gitlab personal access token](https://gitlab.com/-/profile/personal_access_tokens?scopes=api&name=Hacktoberfest%20Checker) to ensure gitlab is supported.

- Create a `.env` file using `.env.example` as an example. Or export the GitHub/Gitlab token as an environment variable for Node.js to use:

  - Mac/Linux: `export GITHUB_TOKEN=YOUR_TOKEN; export GITLAB_TOKEN=YOUR_TOKEN`
  - Windows (cmd.exe): `set GITHUB_TOKEN=YOUR_TOKEN; set GITLAB_TOKEN=YOUR_TOKEN`
  - Windows (PowerShell): `$env: GITHUB_TOKEN=YOUR_TOKEN; GITLAB_TOKEN=YOUR_TOKEN`

- `$ npm install`

- `$ npm run tailwind-gen`

- `$ npm start`

- Point browser to [localhost:5000](http://localhost:5000)

Want to run the API server and the frontend in their processes? Use this:

```bash
$ npm run start-frontend
$ npm run start-server
```

or in a single command...

```bash
$ npm run start-development
```

### Running the app within Docker

As an alternative to the section above, you can run the app within a Docker container:

- `$ docker build -t hacktoberfest-checker .`

- `$ docker run -p 5000:5000 -e "GITHUB_TOKEN=YOUR_TOKEN" hacktoberfest-checker`

or use the docker-compose

- `$ docker-compose up --build`

## Changing styling

Styling is done through [tailwind](https://tailwindcss.com/) as much as possible no CSS should be added and class names favoured.
However, there will be occasions where custom CSS is required, in this case you need to edit `style.css`
and run `npm run tailwind-gen` to generate the new CSS file.

> Note: You should never directly edit `index.css`

## License

MIT © 2015-2021 [Ian Jenkins](https://github.com/jenkoian)
