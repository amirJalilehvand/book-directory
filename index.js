const path = require('path');

//importing 3rd party packages we need
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

//importing our route handling files
const bookRoutes = require('./routes/book');
const adminRoutes = require('./routes/admin');
const authorRoutes = require('./routes/author');

//please define your MONGO_URI using your own mongoDB account
const MONGODB_URI = 'mongodb://<your mongodb username>:<password>@cluster0-shard-00-00.louoq.mongodb.net:27017,cluster0-shard-00-01.louoq.mongodb.net:27017,cluster0-shard-00-02.louoq.mongodb.net:27017/<DataBase name>?ssl=true&replicaSet=atlas-2uvw8h-shard-0&authSource=admin&retryWrites=true&w=majority'

//initializing multer in order to being able to uploading images: file storage 
const fileStorage = multer.diskStorage({
    destination: (req , file , cb) => {
        cb(null , 'images')
    } ,
    filename: (req , file , cb) => {
        //normalizing our file names before we save them (because multer won't recognize ':' character so we replace them by '-')
        cb(null , new Date().toISOString().replace(/:/g , '-') +'_-_'+ file.originalname)
    }
})

//initializing multer in order to being able to uploading images: file filter
const fileFilter = (req , file , cb) => {
    if(file.mimetype === 'images/png' || file.mimetype === 'images/jpg' || file.mimetype === 'images/jpeg'){
        cb(null , true)
    } else {
        cb(null , false)
    }
}

const app = express(); 
app.use(bodyParser.json());

//declaring and using multer as a middleware in order to being able of upload an image in some forms
app.use(multer({storage: fileStorage , fileFilter: fileFilter}).single('image'));

//declaring image folder as an expres static for saving images into
app.use('/images' , express.static(path.join(__dirname , 'images')));

//using our route handlers
app.use('/admin' , adminRoutes);
app.use(bookRoutes);
app.use(authorRoutes);

//setting up our general error handler for every incoming error
app.use((error , req , res , next) => {
    console.log(error);
    const status = error.status;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    })
})

//setting up our monh=go client and connect to the DataBase
mongoose
    .connect(MONGODB_URI)
    .then(result => {
        console.log('DB connected');
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })