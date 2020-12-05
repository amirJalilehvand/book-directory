//importing our Author model
const Author = require('../models/author')

//defining our getAuthors function to handle the way we get all authors
exports.getAuthors = async (req , res , next) => {
    //getting our authors from Author collection and if any error happens, we throw an 404 status error
    const authors = await Author.find();
    if(!authors){
        const error = new Error('sorry no author was found')
        error.status = 404;
        throw error;
    }

    //sending our response
    return res.status(200).json({
        message: "authors list was fetched successfully",
        authors: authors
    })
}

//defining our getAuthor function to handle the way we get a single author by id
exports.getAuthor = async (req , res , next) => {
    const authorId =  req.params.authorId;

    //getting our author from Author collection and if it doesn't exist, we throw an 404 status error
    const author = await Author.findOne({_id: authorId}).populate('booksPublishedBy');
    if(!author){
        const error = new Error('sorry the author was not found!');
        error.status = 404;
        throw error;
    }

    //sending our response
    return res.status(200).json({
        message: 'the author was fetched successfully',
        author: author
    })
}