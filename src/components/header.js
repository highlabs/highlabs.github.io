import React from 'react'
import Link from 'gatsby-link'
import './header.scss'

const Header = ({ siteTitle }) => (
  <header>
    <Link to="/">
      <h1>Highlabs</h1>
    </Link>
  </header>
)

export default Header
