import React from 'react';
import PropTypes from 'prop-types';

import './Paginator.css';

const paginator = ({ onPrevious, onNext, lastPage, currentPage, children }) => (
  <div className="paginator">
    {children}
    <div className="paginator__controls">
      {currentPage > 1 && (
        <button className="paginator__control" onClick={onPrevious}>
          Previous
        </button>
      )}
      {currentPage < lastPage && (
        <button className="paginator__control" onClick={onNext}>
          Next
        </button>
      )}
    </div>
  </div>
);

paginator.propTypes = {
  onPrevious: PropTypes.func, 
  onNext: PropTypes.func, 
  lastPage: PropTypes.number, 
  currentPage: PropTypes.number
};

export default paginator;
