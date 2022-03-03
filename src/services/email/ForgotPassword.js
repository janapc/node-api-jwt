const Emails = require("./Emails");

class ForgotPassword extends Emails {
  constructor(user, token) {
    super();
    this.from = '"Blog Code" <noreply@blogcode.com.br>';
    this.to = user.email;
    this.subject = "Redefine password";
    this.text = `Hello! You requested to redefine your password.Use the token below to redefine your password:\n${token}`;
    this.html = `<h1>Hello</h1> <p>You requested to redefine your password.Use the token below to redefine your password:</br>${token}</p>`;
  }
}

module.exports = ForgotPassword;
