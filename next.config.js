const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();
const withNextEnv = nextEnv();

module.exports = withNextEnv(withCSS(withFonts({
  enableSvg: true
})));
