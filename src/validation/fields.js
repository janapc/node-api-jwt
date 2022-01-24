const HandlerErrors = require("../utils/handlerErrors");

function fieldTypeStringNotNull(value, name) {
  if (typeof value !== "string" || value === 0) {
    throw new HandlerErrors(400, `The field ${name} is required!`);
  }
}

function fieldLengthMin(value, min, name) {
  if (value.length < min) {
    throw new HandlerErrors(
      400,
      `The ${name} field must be less than ${min} caracters!`
    );
  }
}

function fieldLengthMax(value, max, name) {
  if (value.length > max) {
    throw new HandlerErrors(
      400,
      `The ${name} field must be greater than ${max} caracters!`
    );
  }
}

module.exports = { fieldTypeStringNotNull, fieldLengthMax, fieldLengthMin };
