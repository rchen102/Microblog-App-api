const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg'
};

// Configure how multer store the data
const storage = multer.diskStorage({
	//Executed when multer tries to save a file, cb: callback
	destination: (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		let error = new Error("Invalid mime type!");
		if (isValid) {
			error = null;
		}
		// pass back information to multer where to store the file
		// relative path to server.js, null for error handle
		cb(error, 'images'); 
	},
	filename: (req, file, cb) => {
		const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
		const ext = MIME_TYPE_MAP[file.mimetype]; // extension
		cb(null, name + '-' + Date.now() + '.' + ext);
	}     
}); 

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
// muter will extract single file from property named 'image'
router.post('', multer({storage: storage}).single('image'), (req, res) => {
	const url = req.protocol + '://' + req.get('host');
	const post = new Post({
		title: req.body.title,
		content: req.body.content,
		imagePath: url + '/images/' + req.file.filename
	});
    post.save()
	  .then(createdPost => {
	  	res.status(200).json({ 
			message: 'Post added successfully', 
			post: {
				id: createdPost._id,
				title: createdPost.title,
				content: createdPost.content,
				imagePath: createdPost.imagePath
			}
		});
	  });
});

// Update a post by Id
router.put('/:id', multer({storage: storage}).single('image'), (req, res) => {
	let imagePath = req.body.imagePath;
	if(req.file) {
		const url = req.protocol + '://' + req.get('host');
		imagePath = url + '/images/' + req.file.filename;
	}
	const post = new Post({
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		imagePath: imagePath
	});
	Post.updateOne({_id: req.params.id}, post)
		.then(result => {
			res.status(201).json({ message: 'Post updated successfully!' });
		});
});

// Delete a post by Id
router.delete('/:id', (req, res) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(201).json({ message: 'Post deleted successfully!' });
  });
});

module.exports = router;
