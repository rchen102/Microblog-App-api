const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const app = express();
mongoose.connect("mongodb+srv://rchen102:BUqCwla3YWjNO1qH@microblog-db-k7kzd.mongodb.net/microblog?retryWrites=true")
  .then(() => {
    console.log("Connected to database!");
  })
	.catch(() => {
		console.log("Connection failed!");
	});

app.use(bodyParser.json());
app.use(cors());

app.use('/api/posts', postsRoutes);   // filter: only path starts with the url


app.listen(3000, () => {
	console.log('app is running on port 3000');
});

