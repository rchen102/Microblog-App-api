const express = require('express');

const Post = require('../models/post');

const router = express.Router();

// Get all the posts
router.get('', (req, res) => {
	Post.find().then(documents => {
		res.status(200).json({
			message: 'Posts fetched successfully',
			posts: documents
		});
	});
});

// Get post by Id
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => {
			if (post) {
				res.status(200).json(post);
			} else {
				res.status(404).json({ message: 'Post not Found'});
			}
		});
});

// Post a post 
router.post('', (req, res) => {
	const post = new Post({
		title: req.body.title,
		content: req.body.content
	});
    post.save()
	  .then(createdPost => {
	  	res.status(200).json({ message: 'Post added successfully', postId: createdPost._id });
	  });
	
});

// Update a post by Id
router.put('/:id', (req, res) => {
	const post = new Post({
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content
	});
	Post.updateOne({_id: req.params.id}, post)
		.then(result => {
			console.log(result);
			res.status(201).json({ message: 'Post updated successfully!' });
		});
});

// Delete a post by Id
router.delete('/:id', (req, res) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(201).json({ message: 'Post deleted successfully!' });
  });
});

module.exports = router;
