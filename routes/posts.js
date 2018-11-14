const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

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

// Get the posts
router.get('', (req, res) => { 
	const pageSize = +req.query.pagesize; // use + to cast to numberic
	const currentPage = +req.query.page;
	const postQuery = Post.find();
	let fetchedPosts;
	if (pageSize && currentPage) {
		postQuery
			.skip(pageSize * (currentPage - 1))
			.limit(pageSize);
	}
	postQuery
		.then(documents => {
			fetchedPosts = documents;
			return Post.count()  // This is a promise
		})
		.then(count => {
			res.status(200).json({
				message: 'Posts fetched successfully',
				posts: fetchedPosts,
				maxPosts: count
			});
		})
		.catch(error => {
			res.status(500).json({
				message: 'Fetching Posts failed!'
			})
		});
});

// Get one post by Id
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => {
			if (post) {
				res.status(200).json(post);
			} else {
				res.status(404).json({ message: 'Post not Found'});
			}
		})
		.catch(error => {
			res.status(500).json({
				message: 'Fetching Post failed!'
			})
		});
});

// Post a post 
// muter will extract single file from property named 'image'
router.post(
  '', 
  checkAuth,
	multer({storage: storage}).single('image'), 
	(req, res) => {
		const url = req.protocol + '://' + req.get('host');
		const post = new Post({
			title: req.body.title,
			content: req.body.content,
			imagePath: url + '/images/' + req.file.filename,
			creator: req.userData.userId
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
			})
			.catch(error => {
				res.status(500).json({
					message: 'Creating a Post failed!'
				})
			});
  }
);

// Update a post by Id
router.put(
  '/:id', 
  checkAuth,
  multer({storage: storage}).single('image'), 
  (req, res) => {
    let imagePath = req.body.imagePath;
    if(req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
			imagePath: imagePath,
			creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
      .then(result => {
				if (result.nModified > 0) {
					res.status(200).json({ message: 'Post updated successfully!' });
				} else {
					res.status(401).json({ message: 'Post updated failed!' });
				}
			})
			.catch(error => {
				res.status(500).json({
					message: 'Couldnot update Post!'
				})
			});
  }
);

// Delete a post by Id
router.delete('/:id', checkAuth, (req, res) => {
	Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
		.then(result => {
			if (result.n > 0) {
				res.status(201).json({ message: 'Post deleted successfully!' });
			} else {
				res.status(401).json({ message: 'Post deleted failed!' });
			}		
		})
		.catch(error => {
			res.status(500).json({
				message: 'Couldnot delete Post!'
			})
		});
});

module.exports = router;
