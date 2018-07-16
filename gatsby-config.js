module.exports = {
  siteMetadata: {
    title: 'Highlabs',
    siteUrl: 'https://highlabs.github.io',
    description: 'Developer, freelancer & T.A.R.D.I.S. Mechanical',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        postCssPlugins: [
          require('cssnano'),
          require('autoprefixer')
        ]
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography.js',
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          'Open Sans\:400'
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
          include: /images/
      }
    },
    {
      resolve: 'gatsby-plugin-favicon',
      options: {
        logo: './src/images/favicon.png',
        injectHTML: true,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          twitter: false,
          yandex: false,
          windows: false
        }
      }
    }
  ],
}
