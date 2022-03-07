import React from 'react';
import PropTypes from 'prop-types';

import './Input.css';

const filePicker = ({ id, label, control, onChange, onBlur, valid, touched }) => (
  <div className="input">
    <label htmlFor={id}>{label}</label>
    <input
      className={[
        !valid ? 'invalid' : 'valid',
        touched ? 'touched' : 'untouched'
      ].join(' ')}
      type="file"
      id={id}
      onChange={e => onChange(id, e.target.value, e.target.files)}
      onBlur={onBlur}
    />
  </div>
);

filePicker.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  valid: PropTypes.bool,
  touched: PropTypes.bool,
};

export default filePicker;
