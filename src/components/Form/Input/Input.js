import React from 'react';
import PropTypes from 'prop-types';

import './Input.css';

const input = ({ type, placeholder, control, onChange, value, id, label, valid, touched, required, onBlur, rows }) => (
  <div className="input">
    {label && <label htmlFor={id}>{label}</label>}
    {control === 'input' && (
      <input
        className={[
          !valid ? 'invalid' : 'valid',
          touched ? 'touched' : 'untouched'
        ].join(' ')}
        type={type}
        id={id}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(id, e.target.value, e.target.files)}
        onBlur={onBlur}
      />
    )}
    {control === 'textarea' && (
      <textarea
        className={[
          !valid ? 'invalid' : 'valid',
          touched ? 'touched' : 'untouched'
        ].join(' ')}
        id={id}
        rows={rows}
        required={required}
        value={value}
        onChange={e => onChange(id, e.target.value)}
        onBlur={onBlur}
      />
    )}
  </div>
);

input.propTypes = {
  type: PropTypes.string, 
  placeholder: PropTypes.string, 
  control: PropTypes.string, 
  onChange: PropTypes.func, 
  value: PropTypes.string
}

export default input;
