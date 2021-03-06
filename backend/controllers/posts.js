const Post = require('../models/post');
const express = require('express');

const app = express();
app.enable('trust proxy');

exports.createPost = (req, res, next) => {
  app.enable('trust proxy');
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId,
    postCreator: req.userData.postCreator,
    occupation: req.body.occupation,
    company: req.body.company,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: 'Post Added Successfully!',
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Creating a post failed!',
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    occupation: req.body.occupation,
    company: req.body.company,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    imagePath: imagePath,
    creator: req.userData.userId,
    postCreator: req.userData.postCreator,
  });
  Post.updateOne(
    {
      _id: req.params.id,
      creator: req.userData.userId,
      postCreator: req.userData.postCreator,
    },
    post
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Update succesfully' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update post!",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching posts failed!',
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'post not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching posts failed!',
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId,
    postCreator: req.userData.postCreator,
  })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching posts failed!',
      });
    });
};

// filter posts by category
exports.getPostsByCategory = (req, res, next) => {
  const postQuery = Post.find({ category: req.params.id });
  let fetchedPosts;

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments({ category: req.params.id });
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching posts failed again from category!',
      });
    });
};

// filter posts by creator
exports.getPostsByCreator = (req, res, next) => {
  const postQuery = Post.find({ creator: req.params.id });
  let fetchedPosts;

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments({ creator: req.params.id });
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching creator posts failed!',
      });
    });
};
