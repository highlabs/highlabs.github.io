import React from 'react'
import Link from 'gatsby-link'
import { withPrefix } from 'gatsby-link'

import './hero.scss'
import selfie from '../images/daniel.jpg'

class Hero extends React.Component {
  constructor() {
    super()
    this.state = {
      quotes: [
        {
          text: "Im doing a (free) operating system (just a hobby, wont be big and professional like gnu) for 386(486) AT clones.",
          author: "Linus Torvalds"
        }, {
          text: "We know everything, okay? We're prescient.",
          author: "Aaron - Primer"
        }, {
          text: "↑ ↑ ↓ ↓ ← → ← → B A",
          author: "Konami Code"
        }, {
          text: "You want weapons? We’re in a library! Books! The best weapons in the world!",
          author: "The Doctor"
        }, {
          text: "In 900 years of time and space, I’ve never met anyone who wasn’t important",
          author: "The Doctor"
        }, {
          text: "Jamais, em hipótese alguma, deixe um Vogon ler poesias para você.",
          author: "Douglas Adams"
        }, {
          text: "We are just an advanced breed of monkeys on a minor planet of a very average star. But we can understand the Universe. That makes us something very special.",
          author: "Stephen Hawking"
        }, {
          text: "É um erro acreditar que é possível resolver qualquer problema importante usando batatas.",
          author: "Douglas Adams"
        }, {
          text: "Changing the World One Line of Code at a Time",
          author: "Linux Foundation"
        }
      ],
      selectedQuote: {
        text: '',
        author: ''
      }
    }
  }

  componentWillMount() {
    const quotes = this.state.quotes
    const selectedQuote = quotes[Math.floor(Math.random()*quotes.length)]
    this.setState({
      selectedQuote
    })
  }

  render() {
    return (
      <div className="hero columns">
        <div className="column is-4 is-hidden-mobile">
          <img src={selfie} alt="Daniel Oshiro Photo" className="selfie" />
        </div>
        <div className="column content">
          <h2>Hello, my name is Daniel. I'm a Front-End Developer <span>and a T.A.R.D.I.S. Mechanical</span> living in Minas Gerais, Brazil.</h2>
          <h6>{this.state.selectedQuote.text} <small>- {this.state.selectedQuote.author}</small></h6>
        </div>
      </div>
    )
  }
}

export default Hero