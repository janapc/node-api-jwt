const {
  fieldTypeStringNotNull,
  fieldLengthMax,
  fieldLengthMin,
} = require("../validation/fields");

const PostsRepositories = require("../repositories/PostsRepositories");

class PostModel {
  async list() {
    return await PostsRepositories.list();
  }

  async add(post) {
    this.#validationFields(post);
    return await PostsRepositories.add(post);
  }

  #validationFields(post) {
    fieldTypeStringNotNull(post.title, "title");
    fieldTypeStringNotNull(post.content, "content");
    fieldLengthMax(post.content, 140, "content");
    fieldLengthMin(post.title, 5, "title");
  }
}

module.exports = new PostModel();
