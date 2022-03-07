import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './Backdrop.css';

const backdrop = ({ open, onClick }) =>
  ReactDOM.createPortal(
    <div
      className={['backdrop', open ? 'open' : ''].join(' ')}
      onClick={onClick}
    />,
    document.getElementById('backdrop-root')
  );

backdrop.propTypes = {
  open: PropTypes.node,
  onClick: PropTypes.func
}; 

export default backdrop;
