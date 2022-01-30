const {
  fieldTypeStringNotNull,
  fieldLengthMax,
  fieldLengthMin,
} = require("../validation/fields");
const bcrypt = require("bcrypt");

const userRepository = require("../repositories/UsersRepository");
const HandlerErrors = require("../utils/handlerErrors");

class UserModel {
  async list() {
    return await userRepository.list();
  }

  async add(user) {
    this.#validationFiedls(user);

    if (await this.findByEmail(user.email)) {
      throw new HandlerErrors(400, "Email already exists");
    }

    const passwordHash = await this.#genaratePasswordHash(user.password);

    await userRepository.add({ ...user, passwordHash, emailChecked: false });

    return await userRepository.findByEmail(user.email);
  }

  async findByEmail(email) {
    const user = await userRepository.findByEmail(email);

    return user ? user : null;
  }

  async findById(id) {
    const user = await userRepository.findById(id);

    return user ? user : null;
  }

  async remove(id) {
    return await userRepository.remove(id);
  }

  async verifyEmail(id) {
    await userRepository.updateFieldEmailChecked(id, true);
  }

  #genaratePasswordHash(password) {
    return bcrypt.hash(password, 12);
  }

  #validationFiedls(user) {
    fieldTypeStringNotNull(user.name, "name");
    fieldTypeStringNotNull(user.email, "email");
    fieldTypeStringNotNull(user.password, "password");
    fieldLengthMax(user.password, 64, "password");
    fieldLengthMin(user.password, 8, "password");
  }
}

module.exports = new UserModel();
