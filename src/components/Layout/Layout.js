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
  header: PropTypes.node,
  mobileNav: PropTypes.node,
  children: PropTypes.node
};

export default layout;
