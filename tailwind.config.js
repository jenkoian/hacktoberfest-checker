module.exports = {
  content: ['./public/index.html', './src/**/*.js'],
  theme: {
    extend: {
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
      },
      oldcolors: {
        'hack-dark-bg': '#2B3531',
        'hack-light-bg': '#F4F0E1',
        'hack-alt-bg': '#677662',
        'hack-fg': '#F0FDF4',
        'hack-alt-fg': '#91A88C',
        'hack-title': '#DBE8D9',
        'hack-dark-title': '#2B3531',
        'hack-logo': '#F74700',
        'hack-alt-logo': '#B53A25',
        'hack-mid-fg': '#A88771',
      },
      colors: {
        'hack-dark-bg': 'rgb(23 15 30)',
        'hack-light-bg': 'rgb(229, 225, 230)',
        'hack-alt-bg': 'rgb(64, 221, 255)',
        'hack-fg': '#F0FDF4',
        'hack-alt-fg': 'rgb(124, 127, 255)',
        'hack-title': '#7d807d',
        'hack-dark-title': '#2B3531',
        'hack-logo': 'rgb(229, 225, 230)',
        'hack-alt-logo': 'rgb(229, 225, 230)',
        'hack-mid-fg': '#A88771',
      },
      fontSize: {
        '7xl': '5rem',
      },
    },
  },
  variants: {},
  plugins: [],
};
