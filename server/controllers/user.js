const bcrypt = require('bcryptjs');
const process = require('../config/settings.json');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: hash,
        isActivated: false,
      });
      user.temporaryToken = jwt.sign(
        {email: user.email, username: user.username},
        process.env.JWT_KEY,
        {expiresIn: '48h'}
      )
      user.save().then(result => {
        const msg = {
          to: user.email,
          from: 'YOUR_EMAIL@EMAIL.COM',
          subject: 'Account Verification',
          text: 'Hello ' + user.firstName + ', Thank your for becoming a part of this community! :) Please click on the following link to complete your activation:http://localhost:4200/activate/' + user.temporaryToken,
          html: 'Hello ' + user.firstName + ', <br> <br> Thank your for becoming a part of this community! :) <br> Please click on the following link to complete your activation: <a href="http://localhost:4200/activate/' + user.temporaryToken + '"> Activate</a>',
        };
        sgMail.send(msg);

        res.status(201).json({
          message: 'Account successfuly registered! Please check your email for confirmation.',
          result: result
        });
      })
      .catch( err => {
        res.status(500).json({
          message: 'Invalid authentication credentials!'
        });
      });
  });
}

exports.userSignin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).select('+password')
    .then(user => {
      if(!user) {
        return res.status(401).json({
          message: 'There is no account with this email!'
        });
      }
      if(user.isActivated == false) {
        return res.status(401).json({
          message: 'Your account is not activated!'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: 'Invalid email or password!'
        });
      }
      const token =jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        process.env.JWT_KEY,
        {expiresIn: '1h'}
      );
      let userData = {
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        email: fetchedUser.email,
        username: fetchedUser.username
      }
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        user: userData,
      });
    })
    .catch( err => {
      return res.status(500).json({
        message: 'Internal server error!'
      });
    });
}

exports.accActivate = (req, res, next) => {
  User.findOne({temporaryToken: req.params.token}).then(user => {
    if(user) {
      let token = req.params.token;
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) =>{
        if(err){
          res.status(401 ).json({
            message: 'Activation link has expired!'
          });
        } else { 
          user.temporaryToken = false;
          user.isActivated = true;
          user.save().then(result => {
            User.findOne({ _id: user.id }).select('+email').then( fetchedUser => {
              const msg = {
                to: fetchedUser.email,
                from: 'YOUR_EMAIL@EMAIL.COM',
                subject: 'Account Activated!',
                text: 'Hello ' + fetchedUser.firstName + '. Your account is successfully activated!',
                html: 'Hello <strong>' + fetchedUser.firstName + '</strong>, <br><br> Your account is successfully activated!',
              };
              sgMail.send(msg);
            })
          })
          .catch(err => {
            console.log(err);
          })
          res.status(200 ).json({
            message: 'Account successfuly activated!'
          });
        }
      })
    } else {
      res.status(404).json({
        message: 'User not found!'
      })
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching user failed!"
    });
  });
}

exports.getUser = (req, res, next) => {
  User.findById(req.params.id).select('+email').then(user => {
    if(user) {
      let userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      }
      res.status(200).json({
        message: 'User found!',
        user: userData
      });
    } else {
      res.status(404).json({
        message: 'User not found!'
      })
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching user failed!"
    });
  });
}