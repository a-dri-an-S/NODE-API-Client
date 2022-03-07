import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Button.css';

const button = ({ link, mode, design, onClick, disabled, loading, type, children }) =>
  !link ? (
    <button
      className={[
        'button',
        `button--${design}`,
        `button--${mode}`
      ].join(' ')}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? 'Loading...' : children}
    </button>
  ) : (
    <Link
      className={[
        'button',
        `button--${design}`,
        `button--${mode}`
      ].join(' ')}
      to={link}
    >
      {children}
    </Link>
  );

  button.propTypes = {
    link: PropTypes.node,
    mode: PropTypes.string,
    design: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    type: PropTypes.node,
    children: PropTypes.node
  };

export default button;
