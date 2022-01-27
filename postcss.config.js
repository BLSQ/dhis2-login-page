module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('@csstools/postcss-sass')(/* node-sass options */),
    require('postcss-import'),
    require('postcss-url')({
      url: 'inline'
  }),
  ]
}