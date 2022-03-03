# node-api-jwt

## Description:

This project is the final project of the course of the [Segurança em APIs REST](https://cursos.alura.com.br/formacao-node-js-express).

The proposition is to use authentication in API to must security

Used Nodejs, authentication using JWT with passport, Sqlite database, and Redis.

---

## Install:

Before of run the project you have that install Redis in your machine.

Create a new file _.env_ in the root of the project and set these variables:

- _SECRET_JWT_: with a word key that will be used by JWT for cryptography.
- _BASE_URL_: the URL base of your project how _localhost:3000_

To run the project use the steps below:

```sh
## install dependences
$ npm i

## run in development
$ npm run dev

```

This application run in port 3000.

Collection with all routes configuration just import in postman: node-api-jwt.postman_collection.json

---

Made by Janapc 🤘 Get in touch!
