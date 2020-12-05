//importing Schema and model from mongoose 3rd party package
const {Schema, model} = require('mongoose');

//defining our Book schema
const bookSchema = new Schema({
    title: {
        type: String ,
        required: true
    },
    imageUrl: {
        type: String ,
        required: true
    },
    discription: {
        type: String ,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    publishedYear: {
        type: Number ,
        required: true
    },
    edition: {
        type: Number
    }
} , {timestamps: true});

module.exports = model('Book' , bookSchema);