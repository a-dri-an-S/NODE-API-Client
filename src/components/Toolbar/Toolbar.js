import React from 'react';
import PropTypes from 'prop-types';

import './Toolbar.css';

const toolbar = ({ children }) => (
    <div className="toolbar">
        {children}
    </div>
);

toolbar.propTypes = {
    children: PropTypes.node.isRequired
};

export default toolbar;