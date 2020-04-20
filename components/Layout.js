import React from 'react'
import PropTypes from 'prop-types'
import Navigation from "../components/Navigation"

const Layout = ({ children }) => (
  <main>
    <Navigation />
    {children}
  </main>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
