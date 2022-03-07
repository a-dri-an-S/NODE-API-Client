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
    link: PropTypes.node.isRequired,
    mode: PropTypes.string.isRequired,
    design: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    type: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired
  };

export default button;
