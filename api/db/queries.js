const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createUserQuery(username, email, password) {
  try {
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: password,
        role: "user",
      },
    });

    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function createPostQuery(userId, title, content) {
  try {
    await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: {
          connect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error("Error creating new comment:", error);
    throw error;
  }
}

async function createCommentQuery(userId, postId, content) {
  try {
    await prisma.comment.create({
      data: {
        content: content,
        author: {
          connect: { id: userId },
        },
        post: {
          connect: { id: parseInt(postId) },
        },
      },
    });
  } catch (error) {
    console.error("Error creating new comment:", error);
    throw error;
  }
}
async function getPostQuery(postId) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
    return post;
  } catch (error) {
    console.error("Error getting post:", error);
    throw error;
  }
}

async function getAllPostsQuery(postId) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
}

async function updatePostQuery(userId, postId, content, title) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!post) {
      throw new Error("Post not found or access denied.");
    }

    const data = {};
    if (content) data.content = content;
    if (title) data.title = title;
    data.editedAt = new Date();

    await prisma.post.update({
      where: {
        id: postId,
        authorId: userId,
      },
      data: data,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

async function updateCommentQuery(userId, commentId, content) {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
        authorId: userId,
      },
    });

    if (!comment) {
      throw new Error("Comment not found or access denied.");
    }
    await prisma.comment.update({
      where: {
        id: commentId,
        authorId: userId,
      },
      data: {
        content: content,
        editedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
}

async function deletePostQuery(userId, postId) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!post) {
      throw new Error("Post not found or access denied.");
    }
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

async function deleteCommentQuery(userId, commentId) {
  try {
    const post = await prisma.comment.findUnique({
      where: {
        id: commentId,
        authorId: userId,
      },
    });

    if (!post) {
      throw new Error("Comment not found or access denied.");
    }
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

module.exports = {
  createUserQuery,
  createCommentQuery,
  createPostQuery,
  getPostQuery,
  getAllPostsQuery,
  updateCommentQuery,
  updatePostQuery,
  deleteCommentQuery,
  deletePostQuery,
};
