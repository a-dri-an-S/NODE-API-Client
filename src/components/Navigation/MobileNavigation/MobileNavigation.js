import React from 'react';
import PropTypes from 'prop-types';

import NavigationItems from '../NavigationItems/NavigationItems';
import './MobileNavigation.css';

const mobileNavigation = ({ open, mobile, onChooseItem, onLogout, isAuth }) => (
  <nav className={['mobile-nav', open ? 'open' : ''].join(' ')}>
    <ul
      className={['mobile-nav__items', mobile ? 'mobile' : ''].join(' ')}
    >
      <NavigationItems
        mobile
        onChoose={onChooseItem}
        isAuth={isAuth}
        onLogout={onLogout}
      />
    </ul>
  </nav>
);

mobileNavigation.propTypes = {
  open: PropTypes.bool.isRequired,
  mobile: PropTypes.node.isRequired,
  onChooseItem: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired
};

export default mobileNavigation;
