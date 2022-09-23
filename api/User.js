const express = require('express');
const router = express.Router();

//mongodb  user model
const User = require('./../models/User');
// password handler
const bcrypt = require('bcrypt');

//signup
router.post('/signup', (req, res) => {
  let { name, email, password, confirmPassword } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  confirmPassword = confirmPassword.trim();

  if (name == '' || email == '' || password == '' || confirmPassword == '') {
    res.json({
      status: 'FAILED',
      message: 'empty input fields',
    });
  } else if (password !== confirmPassword) {
    res.json({
      status: 'FAILED',
      message: 'passwords do not match',
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: 'FAILED',
      message: 'invalid name entered',
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: 'FAILED',
      message: 'invalid email entered',
    });
  } else if (password.length < 8) {
    res.json({
      status: 'FAILED',
      message: 'password entered is too short',
    });
  } else {
    // checking if the user already exists
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.json({
            status: 'FAILED',
            message: 'user with the provided already exists',
          });
        } else {
          // try to create new user
          // password handling
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
                confirmPassword,
              });
              newUser
                .save()
                .then((result) => {
                  res.json({
                    status: 'SUCCESS',
                    message: 'Singup successful',
                    data: result,
                  });
                })
                .catch((err) => {
                  res.json({
                    status: 'FAILED',
                    message: 'Something went wrong while saving user account',
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: 'FAILED',
                message: 'An error occured while hashing password',
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: 'FAILED',
          message: 'An error occurred while checking for exixting user',
        });
      });
  }
});
//signin
router.post('/signin', (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email == '' || password == '') {
    res.json({
      status: 'FAILED',
      message: 'Email or password is empty',
    });
  } else {
    // checking if user exists
    User.find({ email })
      .then((data) => {
        if (data.length) {
          // User exists

          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                // Password match
                res.json({
                  status: 'SUCCESS',
                  message: 'Signin successful',
                  data: data,
                });
              } else {
                // Password doesn't match
                res.json({
                  status: 'FAILED',
                  message: "Password doesn't match",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: 'FAILED',
                message: 'An error occured while comparing passwords',
              });
            });
        } else {
          // User doesn't exist
          res.json({
            status: 'FAILED',
            message: "User doesn't exist",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: 'FAILED',
          message: 'An error occured while checking for existing user',
        });
      });
  }
});

module.exports = router;
