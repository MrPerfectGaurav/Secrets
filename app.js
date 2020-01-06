//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: [true, 'Email is not specified.']
    },
    password: {
        type: String,
        required: [true, 'Password is not specified.']
    }
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((err) => {
        if (!err) {
            res.render('secrets');
        } else {
            res.send('Error occured while creating your account.');
        }
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, (err, foundUser) => {
        if(!err) {
            if(foundUser.password === password) {
                res.render('secrets');
            } else {
                res.send('Password incorrect.');
            }
        } else {
            res.send('Error occured while login.');
        }
    });
});

app.listen(port, (req, res) => {
    console.log('server has started on port: ' + port + '...');
});