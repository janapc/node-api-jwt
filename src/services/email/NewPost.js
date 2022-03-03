const Emails = require("./Emails");

class NewPost extends Emails {
  constructor(user, postId, postTitle) {
    super();
    this.from = '"Blog Code" <noreply@blogcode.com.br>';
    this.to = user.email;
    this.subject = "New post created in blog";
    this.text = `Hello!You created a new post in the blog and it's already gone publish! ID of post: ${postId}. Title: ${postTitle}`;
    this.html = `<h1>Hello</h1> <p>You created a new post in the blog and it's already gone publish</p><br>ID of post: ${postId}<br> Title: ${postTitle}`;
  }
}

module.exports = NewPost;
