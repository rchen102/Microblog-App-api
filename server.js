const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();
mongoose.connect("mongodb+srv://rchen102:" + process.env.MONGO_ATLAS_PW + "@microblog-db-k7kzd.mongodb.net/microblog?retryWrites=true", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
	.catch(() => {
		console.log("Connection failed!");
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images',express.static(path.join('images')));

app.use(cors());
app.use('/api/posts', postsRoutes);   // filter: only path starts with the url
app.use('/api/users', usersRoutes);   

app.listen(3000, () => {
	console.log('app is running on port 3000');
});

