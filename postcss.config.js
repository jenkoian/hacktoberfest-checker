module.exports = {
  plugins: [
    require('postcss-easy-import'),
    require('postcss-url')({ url: "inline" }),
    require('tailwindcss'),
    require('autoprefixer'),
    require('@fullhuman/postcss-purgecss')({
      content: [
        './public/index.html',
        './src/**/*.js'
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
};
