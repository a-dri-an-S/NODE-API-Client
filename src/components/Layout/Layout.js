import React from 'react';

import './Layout.css';

const layout = ({ header, mobileNav, children }) => (
  <>
    <header className="main-header">{header}</header>
    {mobileNav}
    <main className="content">{children}</main>
  </>
);

export default layout;
