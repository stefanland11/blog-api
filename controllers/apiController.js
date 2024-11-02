const db = require("../db/queries");

const postBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await db.createPostQuery(userId, title, content);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
};

const getPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await db.getPostQuery(parseInt(postId));
    console.log(post);
    res.json({post});
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post data" });
  }
};

const updateBlogPost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;
  try {
    await db.updatePostQuery(parseInt(userId), parseInt(postId), content, title);
    res.json({ message: "Update successful" });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error updating post data" });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  try {
    await db.deletePostQuery(parseInt(userId), parseInt(postId));
    res.json({ message: "Delete successful" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
};

const postComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await db.createCommentQuery(parseInt(userId), parseInt(postId), content);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error creating comment" });
  }
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  try {
    await db.updateCommentQuery(parseInt(userId), parseInt(commentId), content);
    res.json({ message: "Update successful" });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error updating comment data" });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  try {
    await db.deleteCommentQuery(parseInt(userId), parseInt(commentId));
    res.json({ message: "Delete successful" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
};

module.exports = {
    postBlogPost,
    getPost,
    updateBlogPost,
    deletePost,
    postComment,
    updateComment,
    deleteComment
}
