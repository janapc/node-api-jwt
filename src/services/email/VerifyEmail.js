const Emails = require("./Emails");

class VerifyEmail extends Emails {
  constructor(user, address) {
    super();
    this.from = '"Blog Code" <noreply@blogcode.com.br>';
    this.to = user.email;
    this.subject = "Verify e-mail";
    this.text = `Hello! Verify your e-mail here: ${address}`;
    this.html = `<h1>Hello</h1> <p>Verify your e-mail here: <a href="${address}">${address}</a></p>`;
  }
}

module.exports = VerifyEmail;
