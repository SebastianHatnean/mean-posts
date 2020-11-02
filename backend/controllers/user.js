const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/verification-token');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const smtpTransport = require('nodemailer-smtp-transport');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      occupation: req.body.occupation,
      company: req.body.company,
      password: hash,
    });
    user
      .save()
      .then(result => {
        var token = new Token({
          _userId: user._id,
          token: crypto.randomBytes(16).toString('hex'),
        });

        token.save(function (err) {
          if (err) {
            return res.status(5000).send({ msg: err.message });
          }

          let transporter = nodemailer.createTransport({
            service: 'gmail',//smtp.gmail.com  //in place of service use host...
            secure: false,//true
            port: 25,//465
            auth: {
              user: process.env.GMAIL_USERNAME,
              pass: process.env.GMAIL_PASSWORD
            }, tls: {
              rejectUnauthorized: false
            }
          });
          // generate token
          let mailOptions = {
            from: 'Blogging App',
            to: user.email,
            subject: 'Welcome to Blogging',
            text:
            'Hello,\n\n' +
            'Please verify your account by clicking the link: \nhttps://' +
            req.headers.host +
            '/auth/confirmation/' +
            token.token +
            '.\n',
          };

          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.status(500).json({
                message: 'Invalid authentication credentials!',
                error: err,
                mailOptions: mailOptions
              });
            }
            res.status(200).json({
                message: 'User created! A verification email has been sent to ' + user.email + ' .',
                result: result,
              });
          });

        })
      })
      .catch(err => {
        res.status(500).json({
          message: 'Invalid authentication credentials!',
          error: err
        });
      })
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth Failed',
        });
      }
      if (!user.isVerified) return res.status(400).json({
        type: 'not-verified',
        message: 'This user has not been verified. Please check your email!',
      });
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth Failed',
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        occupation: fetchedUser.occupation,
        company: fetchedUser.company,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Invalid authentication credentials',
      });
    });
};

exports.confirmationPost = (req, res, next) => {
  // Find a matching token
  Token.findOne({ token: req.body.token })
    .then(token => {
      if (!token) return res.status(400).send({ type: 'not-verified', message: 'We were unable to find a valid token. Your token might have expired.' });

      User.findOne({ _id: token._userId })
        .then(user => {

            if (!user) return res.status(400).send({ type: 'user-not-found', message: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).json({
              type: 'already-verified',
              message: 'This user has already been verified.',
            });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).json({
                  message: 'The account has been verified. Please log in.',
                  isVerified: true,
                });
            });
        })
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Token error',
      });
    });
};
