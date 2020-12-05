//importing our Author model
const Book = require('../models/book');

//defining our getBooks function to handle the way we get all books
exports.getBooks = async (req , res , next) => {
    //getting our books from Book collection and if any error happens, we throw an 404 status error
    const books = await Book.find();
    if(!books){
        const error = new Error('oops! no books was found');
        error.status = 404;
        throw error;
    }

    //sending our response
    return res.status(200).json({
        message: "books fetched successfully",
        books: books
    })
}

//defining our getBook function to handle the way we get a single book by id
exports.getBook = async (req , res, next) => {
    const bookId = req.params.bookId;

    //getting our books from Book collection and if any error happens, we throw an 404 status error
    const book = await Book.findOne({_id: bookId}).populate('author');
    if(!bookId){
        const error = new Error('oops! book was not found!');
        error.status = 404;
        throw error;
    }

    //sending our response
    return res.status(200).json({
        message: 'book was fetched successfully',
        book: book
    })
}