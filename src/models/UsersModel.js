const {
  fieldTypeStringNotNull,
  fieldLengthMax,
  fieldLengthMin,
  fieldRole,
} = require("../validation/fields");
const bcrypt = require("bcrypt");

const userRepository = require("../repositories/UsersRepository");
const HandlerErrors = require("../utils/handlerErrors");

/**
 * @name UsersModel
 * @description All user manipulation
 */
class UsersModel {
  /**
   * @name list
   * @description get all users
   * @returns a list all users
   */
  async list() {
    return await userRepository.list();
  }

  /**
   * @name add
   * @description create a new user
   * @param {object} user contain email, password, name, role
   * @returns
   */
  async add(user) {
    this.#validationFields(user);

    if (await userRepository.findByEmail(user.email)) {
      throw new HandlerErrors(400, "Email already exists");
    }
    const passwordHash = await this.genaratePasswordHash(user.password);

    await userRepository.add({ ...user, passwordHash, emailChecked: false });

    return await userRepository.findByEmail(user.email);
  }

  /**
   * @name findByEmail
   * @description find user by email
   * @param {string} email email of user
   * @throws if user is not found
   * @returns a user
   */
  async findByEmail(email) {
    const result = await userRepository.findByEmail(email);

    if (!result) {
      throw new HandlerErrors(404, "User is not found");
    }

    return result;
  }

  /**
   * @name findById
   * @description find user by id
   * @param {number} id id of user
   * @throws if user is not found
   * @returns a user
   */
  async findById(id) {
    const result = await userRepository.findById(id);
    if (!result) {
      throw new HandlerErrors(404, "User is not found");
    }

    return result;
  }

  /**
   * @name remove
   * @description delete a user
   * @param {number} id id of user
   */
  async remove(id) {
    await userRepository.remove(id);
  }

  /**
   * @name verifyEmail
   * @description update of field emailChecked to true
   * @param {number} id id of user
   */
  async verifyEmail(id) {
    await userRepository.updateFieldEmailChecked(id, true);
  }

  /**
   * @name updatePassword
   * @description update of field password with new password
   * @param {string} password new password of user
   * @param {number} id id of user
   */
  async updatePassword(password, id) {
    await userRepository.updatePassword(password, id);
  }

  /**
   * @name genaratePasswordHash
   * @description create a hash to password of user
   * @param {string} password password of user
   * @returns the password in formatted hash
   */
  genaratePasswordHash(password) {
    fieldTypeStringNotNull(password, "password");
    fieldLengthMax(password, 64, "password");
    fieldLengthMin(password, 8, "password");

    return bcrypt.hash(password, 12);
  }

  /**
   * @name #validationFields
   * @description valid the fields of user
   * @param {object} user contain email, password, name, role
   */
  #validationFields(user) {
    fieldTypeStringNotNull(user.name, "name");
    fieldTypeStringNotNull(user.email, "email");
    fieldTypeStringNotNull(user.role, "role");
    fieldRole(user.role, "role");
  }
}

module.exports = new UsersModel();
