module.exports = {
  siteMetadata: {
    title: 'Highlabs',
    siteUrl: 'https://highlabs.github.io',
    description: 'Developer, freelancer & T.A.R.D.I.S. Mechanical',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography.js',
      },
    },
  ],
}
