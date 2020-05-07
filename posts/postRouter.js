const express = require("express")

const Posts = require("./postDb.js");

const router = express.Router();


router.get("/", (req, res) => {
  Posts.get(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error retrieving posts." });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  Posts.getById(req.post.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ errorMessage: "The post with that ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The post information could not be retrieved." });
    });
});


router.delete("/:id", validatePostId, (req, res) => {
  Posts.remove(req.post.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The post could not be removed." });
    });
});

router.put('/:id', (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ errorMessage: "Please provide text for the post." });
  } else {
    Posts.update(req.post.id, req.body)
      .then(post => {
        if (!post) {
          res.status(404).json({
            errorMessage: "The post with the specified ID does not exist."
          });
        } else {
          res.status(200).json(post);
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          errorMessage: "The post information could not be modified."
        });
      });
  }
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  Posts.getById(id)
    .then(post => {
      if (!post) {
        res.status(400).json({ errorMessage: "Invalid post id" })
      } else {
        req.post = post
        next();
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: "Could not retrieve post." })
    })
}

module.exports = router;
