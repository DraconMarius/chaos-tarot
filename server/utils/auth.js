//
// This file contains the code to authenticate users using JSON Web Tokens (JWT).
const jwt = require("jsonwebtoken");

// secret used to sign the JWT
const secret = "mysecretssshhhhhhh";
// expiration time for the JWT
const expiration = "2h";

// export the authMiddleware function to be used in the GraphQL resolvers
module.exports = {
  // function for authenticating the request
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers or body
    let token = req.body.token || req.query.token || req.headers.authorization;
    // if token is sent via headers, remove the 'Bearer' string
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // if no token, return request object as is
    if (!token) {
      return req;
    }
    // decode and attach user data to request object
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });

      req.user = data;
    } catch {
      console.log("Invalid token");
    }
    // return updated request object
    return req;
  },
  // function for signing tokens on user login
  signToken: function ({ email, username, _id, firstname, image }) {
    // create a JWT payload containing the user's username and id
    const payload = { email, username, _id, firstname, image };
    // sign the token
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
