import React from 'react'
import './about.scss'

const About = ({ siteTitle }) => (
  <div className="about">
    <div className="content">
      <h2>About:</h2>
      <p>I'm Web Developer since 2011, self-taught, curious and a little bit obsessed by new techs. Linux user since kernel 2.4.0, creating web sites since 2005, and exiting Vim successfully since 2002.</p>
    </div>


    <h3>Skills:</h3>
    <div className="columns">
      <div className="column">
        <h6>Front-end:</h6>
        <ul>
          <li>
            HTML/CSS/SASS
          </li>
          <li>
            JavaScript
          </li>
          <li>
            React, React-Native, Next.js, Gatsby.js
          </li>
          <li>
            Vue, Nuxt.JS, VuePress
          </li>
        </ul>
      </div>
      <div className="column">
        <h6>Backend:</h6>
        <ul>
          <li>
            Firebase
          </li>
          <li>
            HeadlessCMS (Netlify, Prismic, Contentful)
          </li>
          <li>
            AWS EC2, S3, Route53
          </li>
          <li>
            Zeit Now and World
          </li>
        </ul>
      </div>
      <div className="column">
        <h6>Others:</h6>
        <ul>
          <li>
            Linux (Ubuntu, SuSe, ArchLinux)
          </li>
          <li>
            Docker
          </li>
          <li>
            Vagrant
          </li>
        </ul>
      </div>
    </div>
  </div>
)

export default About
