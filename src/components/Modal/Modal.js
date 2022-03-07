import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import './Modal.css';

const modal = ({ title, onCancelModal, onAcceptModal, acceptEnabled, isLoading, children }) =>
  ReactDOM.createPortal(
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <div className="modal__content">{children}</div>
      <div className="modal__actions">
        <Button design="danger" mode="flat" onClick={onCancelModal}>
          Cancel
        </Button>
        <Button
          mode="raised"
          onClick={onAcceptModal}
          disabled={!acceptEnabled}
          loading={isLoading}
        >
          Accept
        </Button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );

  modal.propTypes = {
    title: PropTypes.string.isRequired,
    onCancelModal: PropTypes.func.isRequired,
    onAcceptModal: PropTypes.func.isRequired,
    acceptEnabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired
  };

export default modal;
