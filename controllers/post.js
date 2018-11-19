const Post = require('../models/post');

exports.createPost = (req, res) => {
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

exports.updatePost = (req, res) => {
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
      if (result.n > 0) {
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

exports.getPosts = (req, res) => { 
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
}

exports.getSinglePost = (req, res) => {
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
}

exports.deletePost = (req, res) => {
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
}