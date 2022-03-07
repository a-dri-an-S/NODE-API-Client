import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Backdrop from '../Backdrop/Backdrop';
import Modal from '../Modal/Modal';

const errorHandler = ({ error, onHandle }) => (
  <Fragment>
    {error && <Backdrop onClick={onHandle} />}
    {error && (
      <Modal
        title="An Error Occurred"
        onCancelModal={onHandle}
        onAcceptModal={onHandle}
        acceptEnabled
      >
        <p>{error.message}</p>
      </Modal>
    )}
  </Fragment>
);

errorHandler.propTypes ={
  error: PropTypes.object.isRequired,
  onHandle: PropTypes.func.isRequired
};

export default errorHandler;
