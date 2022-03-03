const {
  fieldTypeStringNotNull,
  fieldLengthMax,
  fieldLengthMin,
} = require("../validation/fields");

const PostsRepositories = require("../repositories/PostsRepositories");
const HandlerErrors = require("../utils/handlerErrors");

/**
 * @name PostsModel
 * @description All posts manipulation
 */
class PostsModel {
  /**
   * @name add
   * @description create a new post
   * @param {object} post contain title, content and authorId
   * @returns new post
   */
  async add(post) {
    this.#validationFields(post);
    return await PostsRepositories.add(post);
  }

  /**
   * @name getById
   * @description get a post by id
   * @param {number} id id of post
   * @throws if post is not found
   * @returns a post
   */
  async getById(id) {
    const result = await PostsRepositories.getById(id);

    if (!result) {
      throw new HandlerErrors(404, "Post is not found");
    }

    return result;
  }

  /**
   * @name getByAuthorId
   * @description get post by authorId
   * @param {number} id id of post
   * @param {number} authorId id of the author of post
   * @throws if post is not found
   * @returns a post
   */
  async getByAuthorId(id, authorId) {
    const result = await PostsRepositories.getByAuthorId(id, authorId);

    if (!result) {
      throw new HandlerErrors(404, "Post is not found");
    }

    return result;
  }

  /**
   * @name remove
   * @description delete a post
   * @param {number} id id of post
   * @param {number} authorId id of the author of post
   */
  async remove(id, authorId) {
    await PostsRepositories.remove(id, authorId);
  }

  /**
   * @name list
   * @description get all posts
   * @returns a list of posts
   */
  async list() {
    return await PostsRepositories.list();
  }

  /**
   * @name #validationFields
   * @description valid the fields of post
   * @param {object} post contain title, content and authorId
   */
  #validationFields(post) {
    fieldTypeStringNotNull(post.title, "title");
    fieldTypeStringNotNull(post.content, "content");
    fieldLengthMax(post.content, 140, "content");
    fieldLengthMin(post.title, 5, "title");
  }
}

module.exports = new PostsModel();
