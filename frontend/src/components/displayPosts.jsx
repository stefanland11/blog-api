import { useEffect, useState } from "react";

function DisplayPosts({ user }) {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [visibleComments, setVisibleComments] = useState({});
  const [visibleAddComment, setVisibleAddComment] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [addCommentContent, setAddCommentContent] = useState("");

  const toggleComments = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle visibility for the specific post
    }));
  };

  console.log(user);

  const toggleAddComment = (postId) => {
    setVisibleAddComment((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const token = localStorage.getItem("token");
  const getPosts = () => {
    console.log("ran");
    fetch("http://localhost:3000/api/getAllPosts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => setPosts(response.posts))
      .catch((error) => setError(error));
  };
  
  useEffect(() => {
    getPosts();
  },[]);

  const handleDeleteComment = (commentId, postId) => {
    fetch(`http://localhost:3000/api/comment/${commentId}`, {
      method: "Delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => {
        window.alert(response.message);
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              };
            }
            return post;
          })
        );
      })
      .catch((error) => setError(error));
  };
  const handleEditComment = (commentId, currentContent) => {
    setEditCommentId(commentId);
    setEditCommentContent(currentContent);
  };
  const handleSaveComment = (commentId, postId) => {
    const bodyData = {
      content: editCommentContent, // Assuming you want to send the updated comment content
    };
    fetch(`http://localhost:3000/api/comment/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => {
        window.alert(response.message);
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: post.comments.map((comment) => {
                  if (comment.id === commentId) {
                    return { ...comment, content: editCommentContent };
                  }
                  return comment;
                }),
              };
            }
            return post;
          })
        );
        setEditCommentId(null);
        setEditCommentContent("");
      })
      .catch((error) => setError(error));
  };

  const handleSaveNewComment = (postId) => {
    const bodyData = {
      content: addCommentContent,
    };

    fetch(`http://localhost:3000/api/comment/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => {
       
        window.alert(response.message);
      })
      .catch((error) => setError(error));
      getPosts();
      setAddCommentContent("");
      toggleAddComment(postId);
  };

  let postsDiv = null;
  console.log(posts);

  if (!posts) {
    return <p>Loading...</p>;
  } else {
    postsDiv = posts.map((post) => (
      <div key={post.id} className="post">
        <p>{post.title}</p>
        <p>{post.content}</p>
        <p>Author: {post.author.username}</p>
        <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
        <p>
          Edited At:{" "}
          {post.editedAt ? new Date(post.editedAt).toLocaleString() : ""}
        </p>
        <button onClick={() => toggleComments(post.id)}>
          {visibleComments[post.id] ? "Hide Comments" : "Show Comments"}
        </button>

        {visibleComments[post.id] &&
        post.comments &&
        post.comments.length > 0 ? (
          <div className="comments">
            <h4>Comments:</h4>
            {post.comments.map((comment) => (
              <div key={comment.id} className="comment">
                {editCommentId === comment.id ? (
                  <div>
                    <input
                      type="text"
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                    />
                    <button
                      onClick={() => handleSaveComment(comment.id, post.id)}
                    >
                      Save
                    </button>
                    <button onClick={() => setEditCommentId(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>{comment.content}</p>
                    <p>By: {comment.author.username}</p>
                    <p>
                      Posted At: {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    {comment.author.id === user.id && (
                      <>
                        <button
                          onClick={() =>
                            handleDeleteComment(comment.id, post.id)
                          }
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            handleEditComment(comment.id, comment.content)
                          }
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div>
              {" "}
              <button onClick={() => toggleAddComment(post.id)}>
                {visibleAddComment[post.id] ? "X" : "Add Comment"}
              </button>
              {visibleAddComment[post.id] && (
                <div>
                  <input
                    type="text"
                    value={addCommentContent}
                    onChange={(e) => setAddCommentContent(e.target.value)}
                  />
                  <button onClick={() => handleSaveNewComment(post.id)}>
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          visibleComments[post.id] && (
            <div>
              <p>No comments yet</p>
              <div>
                {" "}
                <button onClick={() => toggleAddComment(post.id)}>
                  {visibleAddComment[post.id] ? "X" : "Add Comment"}
                </button>
                {visibleAddComment[post.id] && (
                  <div>
                    <input
                      type="text"
                      value={addCommentContent}
                      onChange={(e) => setAddCommentContent(e.target.value)}
                    />
                    <button onClick={() => handleSaveNewComment(post.id)}>
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    ));
  }

  return <>{postsDiv}</>;
}

export default DisplayPosts;
