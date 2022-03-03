const nodemailer = require("nodemailer");

class Emails {
  async sendMail() {
    const configEmail = await this.#configurationEmail();
    const transport = nodemailer.createTransport(configEmail);

    const info = await transport.sendMail(this);

    if (process.env.NODE_ENV !== "production")
      console.log("URL:" + nodemailer.getTestMessageUrl(info));
  }

  async #configurationEmail() {
    if (process.env.NODE_ENV === "production") {
      return {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        secure: true,
      };
    } else {
      const accountTest = await nodemailer.createTestAccount();
      return {
        host: "smtp.ethereal.email",
        auth: accountTest,
      };
    }
  }
}
module.exports = Emails;
