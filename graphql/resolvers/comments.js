const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "comment body must not be empty",
          },
        });
      }
      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId); //* busca en el post actual por el id del comentario que se desea borrar, de encontrarlo retorna el indice

        if (post.comments[commentIndex].username === username) {
          //* compara el nombre del usuario con el comentario que desea borrar, ya que debe ser el dueño del comentario
          post.comments.splice(commentIndex, 1); //* Eliminamos el comentario del post
          await post.save();
          return post;
        } else throw new AuthenticationError("Action no allowed");
      } else throw new UserInputError("Post not found");
    },
  },
};
