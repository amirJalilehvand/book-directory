//importing Schema and model from mongoose 3rd party package
const {Schema, model} = require('mongoose');

//defining our Author schema
const authorSchema = new Schema({
    name: {
        type: String ,
        required: true
    },
    booksPublishedBy: [
        {
            type: Schema.Types.ObjectId ,
            ref: 'Book',
            required: true
        }
    ],
    bio: {
        type: String ,
        required: true
    },
    bornYear: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String
    }
});

module.exports = model('Author' , authorSchema);