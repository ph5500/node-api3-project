const express = require("express");

const Users = require("./userDb.js")
const Posts = require("../posts/postDB.js");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the database."
      });
    });
});

router.post("/:id/posts", validatePost, (req, res) => {
  const { id } = req.user;
  const post = { ...req.body, user_id: id }

  Posts.insert(post)
    .then(inserted => {
      if (inserted) {
        res.status(201).json(inserted);
      } else {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "There was an error while saving this post to the database."
      });
    });
});

router.get("/", (req, res) => {
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error Retrieving the users." });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  console.log("params", req.params)
  Users.getById(req.user.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ errorMessge: "The user with that ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.user.id)
    .then(posts => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({
          errorMessage: "The post with that specified ID does not exist."
        });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
      json({ errorMessage: "The post information could not be retrieved." });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.user.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "The user could not be removed."
      });
    });
});

router.put("/:id", (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ errorMessage: "Please provide a name for the user." });
  } else {
    Users.update(req.user.id, req.body)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({
            errorMessage: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          errorMessage: "The user information could not be modified."
        });
      });
  }
});

//custom middleware

// function logger(req, res, next) {
//   console.log(
//     `[${new Date().toISOString()}] ${req.method}
//              to ${req.url} from ${req.get('Origin')}`
//   );
//   next();
// }

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      if (!user) {
        res.status(400).json({ errorMessage: "invalid user id" })
      } else {
        req.user = user;
        console.log("req.user", req.user)
        next();
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: "Could not retrieve user." })
    })
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ errorMessage: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ errorMessage: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ errorMessage: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ errorMessage: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;



// const express = require('express');
// const path = require('path');

// const server = express();

//global middleware
// server.use(express.json());
// server.use(morgan("dev"));
// server.use(helmet());


//write custom middleware
// function logger(req, res, next) {
//     console.log(
//         `[${new Date().toISOString()}] ${req.method}
//              to ${req.url} from ${req.get('Origin')}`
//     );
//     next();
// }

// function atGate(req, res, next) {
//     console.log('At the gate, about to be eaten');

//     next();
// }

// function auth(req, res, next) {
//     if (req.url === '/mellon') {
//         next();
//     } else {
//         res.send('You shall not pass!');
//     }

// }

// server.use(logger);
// server.use(atGate);

// server.get('/mellon', auth, (req, res) => {
//     console.log('Gate opening...');
//     console.log('Inside and safe!');
//     res.send('Welcome Traveller!');
// })
