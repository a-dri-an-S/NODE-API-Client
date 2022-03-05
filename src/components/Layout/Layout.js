import React from 'react';
import PropTypes from 'prop-types';

import './Layout.css';

const layout = ({ header, mobileNav, children }) => (
  <>
    <header className="main-header">{header}</header>
    {mobileNav}
    <main className="content">{children}</main>
  </>
);

layout.propTypes = {
  header: PropTypes.node.isRequired,
  mobileNav: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

export default layout;
