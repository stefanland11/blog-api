const { Router } = require("express");
const apiRouter = Router();
const apiController = require("../controllers/apiController");
const jwtAuth = require("../config/jwtAuth");

//post crud
apiRouter.post("/api/blog-post", jwtAuth, apiController.postBlogPost);
apiRouter.get("/api/blog-post/:postId", jwtAuth, apiController.getPost);
apiRouter.get("/api/getAllPosts", jwtAuth, apiController.getAllPosts);
apiRouter.put("/api/blog-post/:postId", jwtAuth, apiController.updateBlogPost);
apiRouter.delete("/api/blog-post/:postId", jwtAuth, apiController.deletePost);
//comment crud
apiRouter.post("/api/comment/:postId", jwtAuth, apiController.postComment);
apiRouter.put("/api/comment/:commentId", jwtAuth, apiController.updateComment);
apiRouter.delete("/api/comment/:commentId", jwtAuth, apiController.deleteComment);

module.exports = apiRouter;