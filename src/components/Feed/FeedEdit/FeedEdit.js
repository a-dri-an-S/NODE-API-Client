import React, { useState, useEffect } from 'react';

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
        .catch(e => {
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
      let formIsValid = true;
      for (const inputName in updatedForm) {
        if (inputName === 'title' || inputName === 'image' || inputName === 'content') {
          formIsValid = formIsValid && updatedForm[inputName].valid;
        }
      }
      return {
        ...updatedForm,
        formIsValid: formIsValid
      };
    });
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
    setFormIsValid(false);
    setImagePreview(null);
  };

  return (
    <section>
      {
        editing ?
          <>
            <Backdrop onClick={cancelPostChangeHandler} />
            <Modal
              title="New Post"
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

export default FeedEdit;
