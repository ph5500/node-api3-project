const express = require('express');

const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');

const server = express();

server.use(express.json());

server.use('/api/users', logger, userRouter)
server.use('/api/posts', logger, postRouter)

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} request made to ${req.originalUrl} on ${Date()}`)
  next();
}

module.exports = server;
