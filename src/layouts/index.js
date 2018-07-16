import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Header from '../components/header'
import './index.scss'

import ogimage from '../images/og_image.jpeg'
const Layout = ({ children, data }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'Highlabs' },
        { name: 'keywords', content: 'highlabs, front-end, freelancer, developer' },
        // Facebook
        { property: 'og:url', content: 'http://highlabs.github.io'},
        { property: 'og:title', content: 'Highlabs'},
        { property: 'og:description', content: 'In 900 years of time and space, I’ve never met anyone who wasn’t important - The Doctor'},
        { property: 'og:image', content: ogimage},
        // Twitter
        { name: 'twitter:card', content: 'summary'},
        { name: 'twitter:site', content: '@dobrado'},
        { name: 'twitter:creator', content: '@dobrado'}
      ]}


    />
    <Header siteTitle={data.site.siteMetadata.title} />
    <div>
      {children()}
    </div>
  </div>
)

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
