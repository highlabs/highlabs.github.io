import React from 'react'
import Link from 'gatsby-link'
import Logo from '../images/logo.svg'
import './header.scss'

const Header = ({ siteTitle }) => (
  <header>
    <Link to="/">
      <Logo className="logo"/>
    </Link>
  </header>
)

export default Header
