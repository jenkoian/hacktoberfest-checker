module.exports = {
  theme: {
    extend: {
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
      },
      colors: {
        'dark-blue': '#072540',
        'dark-blue-alt': '#183d5d',
        'light-blue': '#93c2db',
        'mid-blue': '#0069ff',
        'mid-purple': '#A11EC6',
        'mid-grey': '#99a1b3',
        yellow: '#fff922',
        'dark-pink': '#9c4668',
        'light-pink': '#ff8ae2',

        // Light mode additions
        'white-grey': '#f5f5f5',
        'light-grey': '#e3e4e4',
        'soft-blue': '#7c99a9',
        'dark-grey': '#333333',
      },
      fontSize: {
        '7xl': '5rem',
      },
    },
  },
  variants: {},
  plugins: [],
};
