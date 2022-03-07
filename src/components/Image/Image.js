import React from 'react';
import PropTypes from 'prop-types';

import './Image.css';

const image = ({ imageUrl, contain, left }) => (
  <div
    className="image"
    style={{
      backgroundImage: `url('${imageUrl}')`,
      backgroundSize: contain ? 'contain' : 'cover',
      backgroundPosition: left ? 'left' : 'center'
    }}
  />
);

image.propTypes = {
  imageUrl: PropTypes.string,
  contain: PropTypes.string,
  left: PropTypes.string
};

export default image;
