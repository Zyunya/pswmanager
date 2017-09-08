var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var es6Promise = require('es6-promise');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var jwt = require('jwt-simple');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var seckey = fs.readFileSync('secret.pub');

mongoose.Promise = es6Promise.Promise;
var db;

secret_key = () => {
    crypto.randomBytes(48, function (err, buffer) {
        fs.writeFile('secret.pub', buffer.toString('base64'), (err) => {
            if (err) throw err;
            console.log('saved')
        })
    })
}
//secret_key();
function encrypt(text) {
    var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

app.listen(3000, () => { console.log('Listening To 3000'); })
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost/myapi', function () {
    console.log('MongoDB connected sucessfully');
})

var userSchema = new mongoose.Schema({
    login: { type: String, required: true },
    password: { type: String, required: true, select: false },

});
var Apps = new mongoose.Schema({
    user_id: { type: mongoose.Schema.ObjectId, required: true, select: true },
    name: { type: String, required: true },
    login: { type: String, required: true },
    password: { type: String, required: true },

});
var User = db.model('Users', userSchema);
var Appsmd = db.model('Myapps', Apps)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Headers', 'content-type,json,x-auth');
    next();
});
app.use(bodyParser.json());

app.post('/signup', (req, res) => {

    var login = req.body.login.replace(/[<|>|!|/|\/|/|\'|%|\"|{|}|\,]/g,"");
    var password = req.body.password.replace(/[<|>|!|/|\/|/|\'|%|\"|{|}|\,]/g,"");

    var user = new User({
        login: login,
        password: password
    })
    User.findOne({ login: login }).select('login').exec((err, result) => {
        if (err) return res.status(401).json({ text: err });
        if (!password) return res.status(403).json({ text: 'fill all fields' });
        if (result) return res.status(200).json({ text: 'User Exists' });
        else {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) return res.status(500).json({ text: 'Error Occurred', error: err });
                user.password = hash;
                user.save(function (err, saveres) {
                    if (err) return res.status(403).json({ text: err });
                    res.status(200).json({ text: 'Success , Now You Can Sign In' });
                })
            })
        }
    })
})

app.post('/signin', (req, res) => {
    var login = req.body.login.replace(/[<|>|!|/|\/|/|\'|%|\"|{|}|\,]/g,"");
    var pswrd = req.body.password.replace(/[<|>|!|/|\/|/|\'|%|\"|{|}|\,]/g,"");
    User.findOne({ login: req.body.login }, { __id: true, login: true }).select('password').exec((err, result) => {
        if (err) return res.status(500).json({ text: "Error Occurred" });
        if (!result) return res.status(401).json({ text: "Such User Not Founded" })
        bcrypt.compare(pswrd, result.password, function (err, valid) {
            if (err) return res.status(500).json({ text: "Error Occured" });
            if (!valid) return res.status(401).json({ text: "Wrong Password" })
            var token = jwt.encode({ id: result.id, login: result.login }, seckey);
            return res.status(200).json({ text: "Auth Success", status: "OK", token: token })
        })
    })
})

app.post('/addapp', (req, res) => {

    if (!req.headers['x-auth']) return res.status(401).json({ text: 'Not Authorized' })
    var dec = jwt.decode(req.headers['x-auth'], seckey);
    var newapp = new NewApp({
        user_id: dec.id,
        name: req.body.name,
        login: req.body.login,
        password: req.body.password,
    });
    newapp.password = encrypt(newapp.password);
    newapp.save(function (err, saveres) {
        if (err) return res.status(403).json({ text: err });
        res.status(200).json({ status: '1', text: 'New App Successfully added' });
    })
})

app.post('/getapps', (req, res) => {
    if (!req.headers['x-auth']) return res.status(401).json({ text: 'Not Authorized' })
    var dec = jwt.decode(req.headers['x-auth'], seckey);
    Appsmd.find({ user_id: dec.id }).sort({ _id: -1 }).exec((err, docs) => {
        if (err) return res.status(500).json({ text: err });
        docs.forEach((elm, index) => { elm.password = decrypt(elm.password) })
        res.status(200).json({ docs: docs, text: 'Data Fetched Successfully' });

    })
})

app.post('/deleteapp', (req, res) => {
    var appid = req.body.appid;
    if (!req.headers['x-auth']) return res.status(401).json({ text: 'Not Authorized' })
    var dec = jwt.decode(req.headers['x-auth'], seckey);
    Appsmd.remove({ _id: appid, user_id: dec.id }).exec((err) => {
        if (err) return res.status(500).json({ text: err });
        res.status(200).json({ status: '1', text: 'Deleted Successfully' });
    })

})

app.post('/updateapp', (req, res) => {

    if (!req.headers['x-auth']) return res.status(401).json({ text: 'Not Authorized' });
    var dec = jwt.decode(req.headers['x-auth'], seckey);
    var appid = req.body.appid;
    var newapp = {
        login: req.body.login,
        password: encrypt(req.body.password),
    };
    Appsmd.findOneAndUpdate({ _id: appid, user_id: dec.id }, { $set: newapp }, { upsert: false }).exec((err, doc) => {
        if (err) return res.status(500).json({ text: err });
        res.status(200).json({ status: '1', text: 'Updated Successfully' });
    })

})