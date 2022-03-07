import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import MobileToggle from '../MobileToggle/MobileToggle';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';

import './MainNavigation.css';

const mainNavigation = ({ onOpenMobileNav, onLogout, isAuth }) => (
  <nav className="main-nav">
    <MobileToggle onOpen={onOpenMobileNav} />
    <div className="main-nav__logo">
      <NavLink to="/">
        <Logo />
      </NavLink>
    </div>
    <div className="spacer" />
    <ul className="main-nav__items">
      <NavigationItems isAuth={isAuth} onLogout={onLogout} />
    </ul>
  </nav>
);

mainNavigation.propTypes = {
  onOpenMobileNav: PropTypes.func,
  onLogout: PropTypes.func,
  isAuth: PropTypes.bool
}

export default mainNavigation;
