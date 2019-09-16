module.exports = {
    plugins: [
        require('postcss-easy-import'),
        require("postcss-url")({ url: "inline" }),
        require('tailwindcss'),
        require('autoprefixer')
    ]
};
