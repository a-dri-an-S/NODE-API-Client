import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import Input from '../../Form/Input/Input';
import FilePicker from '../../Form/Input/FilePicker';
import Image from '../../Image/Image';
import { required, length } from '../../../util/validators';
import { generateBase64FromImage } from '../../../util/image';
import { usePrevious } from '../../../hooks/usePrevious';

const POST_FORM = {
  title: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  },
  image: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  content: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  }
};

const FeedEdit = ({ editing, prevEditing, selectedPost, prevSelectedPost, loading, onCancelEdit, onFinishEdit }) => {
  const [postForm, setPostForm] = useState(POST_FORM);
  const [formIsValid, setFormIsValid] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const prevPostForm = usePrevious(postForm);

  useEffect(() => {
    console.log(editing, selectedPost)
    if (
      editing &&
      prevEditing !== editing &&
      prevSelectedPost !== selectedPost
    ) {
      const postForm = {
        title: {
          ...prevPostForm.title,
          value: selectedPost.title,
          valid: true
        },
        image: {
          ...prevPostForm.image,
          value: selectedPost.imagePath,
          valid: true
        },
        content: {
          ...prevPostForm.content,
          value: selectedPost.content,
          valid: true
        }
      };
      setPostForm(postForm);
      setFormIsValid(true);
    }
  }, [editing, selectedPost, prevEditing, prevSelectedPost]);


  const postInputChangeHandler = (input, value, files) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then(b64 => {
          setImagePreview(b64)
        })
        .catch(err => {
          setImagePreview(null);
        });
    }
    setPostForm(prevState => {
      let isValid = true;
      for (const validator of prevState[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState,
        [input]: {
          ...prevState[input],
          valid: isValid,
          value: files ? files[0] : value
        }
      };

      return {
        ...updatedForm
      };
    });

    if (postForm.title.valid && postForm.image.valid && postForm.content.valid) {
      setFormIsValid(true)
    };
  };

  const inputBlurHandler = input => {
    setPostForm(prevState => {
      return {
        ...prevState,
        [input]: {
          ...prevState[input],
          touched: true
        }
      };
    });
  };

  const cancelPostChangeHandler = () => {
    setPostForm(POST_FORM);
    setFormIsValid(false);
    onCancelEdit();
  };

  const acceptPostChangeHandler = () => {
    const post = {
      title: postForm.title.value,
      image: postForm.image.value,
      content: postForm.content.value
    };
    onFinishEdit(post);
    setPostForm(POST_FORM);
    setFormIsValid(true);
    setImagePreview(null);
  };

  return (
    <section>
      {
        editing ?
          <>
            <Backdrop onClick={cancelPostChangeHandler} />
            <Modal
              title={selectedPost ? "Edit Post" : "New Post"}
              acceptEnabled={formIsValid}
              onCancelModal={cancelPostChangeHandler}
              onAcceptModal={acceptPostChangeHandler}
              isLoading={loading}
            >
              <form>
                <Input
                  id="title"
                  label="Title"
                  control="input"
                  onChange={postInputChangeHandler}
                  onBlur={() => inputBlurHandler('title')}
                  valid={postForm['title'].valid}
                  touched={postForm['title'].touched}
                  value={postForm['title'].value}
                />
                <FilePicker
                  id="image"
                  label="Image"
                  control="input"
                  onChange={postInputChangeHandler}
                  onBlur={() => inputBlurHandler('image')}
                  valid={postForm['image'].valid}
                  touched={postForm['image'].touched}
                />
                <div className="new-post__preview-image">
                  {!imagePreview && <p>Please choose an image.</p>}
                  {imagePreview && (
                    <Image imageUrl={imagePreview} contain left />
                  )}
                </div>
                <Input
                  id="content"
                  label="Content"
                  control="textarea"
                  rows="5"
                  onChange={postInputChangeHandler}
                  onBlur={() => inputBlurHandler('content')}
                  valid={postForm['content'].valid}
                  touched={postForm['content'].touched}
                  value={postForm['content'].value}
                />
              </form>
            </Modal>
          </>
          : 
          null
        }
    </section>
  )
};

FeedEdit.propTypes = {
  editing: PropTypes.bool,
  prevEditing: PropTypes.bool,
  selectedPost: PropTypes.object,
  prevSelectedPost: PropTypes.object,
  loading: PropTypes.bool,
  onCancelEdit: PropTypes.func,
  onFinishEdit: PropTypes.func
}

export default FeedEdit;
