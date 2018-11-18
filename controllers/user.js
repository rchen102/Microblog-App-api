const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)   // 10 is the salt number, the bigger it is the safer is is as well higher work time
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created successfully!'
          })
        })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid authentication credentials!\n Email Address already exist!'
          });
        });
    });
}

exports.userLogin = (req, res) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {    // Find user and assign it to fetchedUser
      if (!user) {   // can not find the email
        // why return here, because we do not want code continue to excute if user doesnot exist
        return res.status(401).json({  
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);   // compare method will return a promise
    })
    .then(result => {   // password is not right, true: successful, false: fail
      if (!result) { 
        return res.status(500).json({
          error: err
        });
      }
      // Create token
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id }, 
        'secret_this_should_be_longer',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        message: "Auth successful",
        token: token,
        expiresIn: 3600,  // 3600 s = 1 h
        userId: fetchedUser._id
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: "Please enter right Email or Password!"
      });
    });
}