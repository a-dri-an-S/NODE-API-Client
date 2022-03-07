import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';

import { usePrevious } from '../../hooks/usePrevious';

const Feed = ({ token, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(1);
  const [postLoading, setPostLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(null);

  const prevEditing = usePrevious(isEditing);
  const prevSelectedPost = usePrevious(editPost);

  useEffect(() => {
    const graphqlQuery = {
      query: `
        {
          user {
            status
          }
        }
      `
    };
    fetch('http://localhost:8080/graphql', {
      method: "POST",
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error(
            "Fetching status failed!"
          );
        }
        setStatus(resData.data.user.status);
      })
      .catch(catchError);

    loadPosts();

  }, [token]);

  const loadPosts = (direction)=> {
    if (direction) {
      setPostLoading(true);
      setPosts([]);
    }
    let page = postPage;
    if (direction === 'next') {
      page++;
      setPostPage(page);
    }
    if (direction === 'previous') {
      page--;
      setPostPage(page);
    }
    const graphqlQuery = {
      query: `
        query FetchPosts($page: Int) {
          posts(page: $page) {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
            totalPosts
          }
        }
      `,
      variables: {
        page: page
      }
    }
    fetch(`http://localhost:8080/graphql`, {
      method: "POST",
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error(
            "Fetching posts failed!"
          );
        }
        setPosts(resData.data.posts.posts.map(post => {
          return {
            ...post,
            imagePath: post.imageUrl
          };
        }));
        setTotalPosts(resData.data.posts.totalPosts);
        setPostLoading(false);
      })
      .catch(catchError);
  };

  const statusUpdateHandler = event => {
    const graphqlQuery = {
      query: `
        mutation UpdateUserStatus($status: String!) {
          updateStatus(status: $status) {
            status
          }
        }
      `,
      variables: {
        status: status
      }
    }
    event.preventDefault();
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error(
            "Status update failed!"
          );
        }
        console.log(resData);
      })
      .catch(catchError);
  };

  const newPostHandler = () => {
    setIsEditing(true);
  };

  const startEditPostHandler = postId => {
    const loadedPost = { ...posts.find(p => p._id === postId) };
    setIsEditing(true);
    setEditPost(loadedPost);
  };

  const cancelEditHandler = () => {
    setIsEditing(false);
    setEditPost(null);
  };

  const finishEditHandler = postData => {
    setEditLoading(true);
    const formData = new FormData();
    formData.append('image', postData.image);
    if (editPost) {
      formData.append('oldPath', editPost.imagePath);
    }

    fetch('http://localhost:8080/post-image', {
      method: "PUT",
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData
    })
      .then(res => res.json())
      .then(fileResData => {
        const imageUrl = fileResData.filePath || 'undefined';
        let graphqlQuery = {
          query: `
        mutation CreateNewPost($title: String!, $content: String!, $imageUrl: String!){
            createPost(postInput: { title: $title, content: $content, imageUrl: $imageUrl }) {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
          }
        `,
          variables: {
            title: postData.title,
            content: postData.content,
            imageUrl: imageUrl
          }
        };
        if (editPost) {
          graphqlQuery = {
            query: `
                mutation UpdateExistingPost($id: ID!, $title: String!, $content: String!, $imageUrl: String!){
                  updatePost(id: $id, postInput: { title: $title, content: $content, imageUrl: $imageUrl }) {
                  _id
                  title
                  content
                  imageUrl
                  creator {
                    name
                  }
                  createdAt
                }
              }
          `,
            variables: {
              id: editPost._id,
              title: postData.title,
              content: postData.content,
              imageUrl: imageUrl
            }
          };
        }
        return fetch('http://localhost:8080/graphql', {
          method: "POST",
          body: JSON.stringify(graphqlQuery),
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        })
      })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Check your password and email!"
          );
        }
        if (resData.errors) {
          throw new Error(
            "User login failed!"
          );
        }
        let resDataField = 'createPost';
        if (editPost) {
          resDataField = 'updatePost';
        }
        const post = {
          _id: resData.data[resDataField]._id,
          title: resData.data[resDataField].title,
          content: resData.data[resDataField].content,
          creator: resData.data[resDataField].creator,
          createdAt: resData.data[resDataField].createdAt,
          imagePath: resData.data[resDataField].imageUrl
        };
        let updatedPosts = [...posts];
        let updatedTotalPosts = totalPosts;
        if (editPost) {
          const postIndex = posts.findIndex(
            p => p._id === editPost._id
          );
          updatedPosts[postIndex] = post;
        } else {
          updatedTotalPosts++;
        }
        if (posts.length >= 2) {
          updatedPosts.pop();
        }
        updatedPosts.unshift(post);
        setPosts(updatedPosts);
        setIsEditing(false);
        setEditPost(null);
        setEditLoading(false);
        setTotalPosts(updatedTotalPosts);
      })
      .catch(err => {
        console.log(err);
        setIsEditing(false);
        setEditPost(null);
        setEditLoading(false);
        setError(err);
      });
  };

  const statusInputChangeHandler = (input, value) => {
    setStatus(value);
  };

  const deletePostHandler = postId => {
    setPostLoading(true);
    const graphqlQuery = {
      query: `
        mutation DeleteUserPost($id: ID!){
          deletePost(id: $id)
        }
      `,
      variables: {
        id: postId
      }
    }
    fetch(`http://localhost:8080/graphql`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error(
            "Deleting the post failed!"
          );
        }
        console.log(resData);
        const updatedPosts = posts.filter(p => p._id !== postId);
        setPosts(updatedPosts);
        setPostLoading(false);

      })
      .catch(err => {
        console.log(err);
        setPostLoading(false);
      });
  };

  const errorHandler = () => {
    setError(null);
  };

  const catchError = error => {
    setError(error);
  };

  return (
    <>
      <ErrorHandler error={error} onHandle={errorHandler} />
      <FeedEdit
        editing={isEditing}
        prevEditing={prevEditing}
        selectedPost={editPost}
        prevSelectedPost={prevSelectedPost}
        loading={editLoading}
        onCancelEdit={cancelEditHandler}
        onFinishEdit={finishEditHandler}
      />
      <section className="feed__status">
        <form onSubmit={statusUpdateHandler}>
          <Input
            type="text"
            placeholder="Your status"
            control="input"
            onChange={statusInputChangeHandler}
            value={status}
          />
          <Button mode="flat" type="submit">
            Update
          </Button>
        </form>
      </section>
      <section className="feed__control">
        <Button mode="raised" design="accent" onClick={newPostHandler}>
          New Post
        </Button>
      </section>
      <section className="feed">
        {postLoading && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Loader />
          </div>
        )}
        {posts.length <= 0 && !postLoading ? (
          <p style={{ textAlign: 'center' }}>No posts found.</p>
        ) : null}
        {!postLoading && (
          <Paginator
            onPrevious={loadPosts.bind(this, 'previous')}
            onNext={loadPosts.bind(this, 'next')}
            lastPage={Math.ceil(totalPosts / 2)}
            currentPage={postPage}
          >
            {posts.map(post => (
              <Post
                key={post._id}
                id={post._id}
                author={post.creator.name}
                date={new Date(post.createdAt).toLocaleDateString('en-US')}
                title={post.title}
                image={post.imageUrl}
                content={post.content}
                onStartEdit={() => startEditPostHandler(post._id)}
                onDelete={() => deletePostHandler(post._id)}
              />
            ))}
          </Paginator>
        )}
      </section>
    </>
  );
}

Feed.propTypes = {
  token: PropTypes.string,
  userId: PropTypes.string
};

export default Feed;
