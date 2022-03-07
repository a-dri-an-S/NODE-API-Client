import React from 'react';
import PropTypes from 'prop-types';

import './MobileToggle.css';

const mobileToggle = ({ onOpen }) => (
  <button className="mobile-toggle" onClick={onOpen}>
    <span className="mobile-toggle__bar" />
    <span className="mobile-toggle__bar" />
    <span className="mobile-toggle__bar" />
  </button>
);

mobileToggle.propTypes = {
  onOpen: PropTypes.func
};

export default mobileToggle;
