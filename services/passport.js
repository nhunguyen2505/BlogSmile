var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const usermodels = require('../models/user') 
// const bcrypt = require('bcrypt')
// const emailValidator = require('email-validator')

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser((id, done) => {
    accountModel.findById(id).then(user => {
        done(null, user)
    })
});

passport.use(new GoogleStrategy({
    clientID: '928069085641-k7h1um7jjjioku384jpppqgiekbf29hi.apps.googleusercontent.com',
    clientSecret: 'K2-ENO9lA4Kw1R_g1KoBOR2i',
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    usermodels.findOne({id: profile.id}).then(existingUser => {
        if(profile._json.hd == "student.tdtu.edu.vn"){
            if (existingUser) {
                done(null, existingUser);
            } else {
                new usermodels({id: profile.id, name: profile._json.name, email: profile._json.email,img: profile._json.picture,class:"", role: '0'}).save().then(user => done(null, user));
            }
        }else{
            done(null, null)
        }
    })
}))
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
  function(username, password, done) {
    usermodels.findOne({ email: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect Username.' });
      }
      if(user){
          if(user.password === password){
            return done(null, user);
          }else {
            return done(null, false, { message: 'Incorrect Password.' });
          }
      }
    });
  }
));