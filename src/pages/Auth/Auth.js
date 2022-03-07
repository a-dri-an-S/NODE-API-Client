import React from 'react';
import PropTypes from 'prop-types';

import './Auth.css';

const auth = ({ children }) => <section className="auth-form">{children}</section>;

auth.propTypes = {
    children: PropTypes.node
}

export default auth;
