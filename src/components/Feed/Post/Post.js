import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../Button/Button';
import './Post.css';

const post = ({ id, author, date, title, onStartEdit, onDelete }) => (
  <article className="post">
    <header className="post__header">
      <h3 className="post__meta">
        Posted by {author} on {date}
      </h3>
      <h1 className="post__title">{title}</h1>
    </header>
    <div className="post__actions">
      <Button mode="flat" link={id}>
        View
      </Button>
      <Button mode="flat" onClick={onStartEdit}>
        Edit
      </Button>
      <Button mode="flat" design="danger" onClick={onDelete}>
        Delete
      </Button>
    </div>
  </article>
);

post.propTypes = {
  id: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
  onStartEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default post;
