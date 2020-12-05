//importing path and fs
const path = require('path');
const fs = require('fs');

//importing validationResult from express-validator for checking the validation of incoming request.body inputs
const {validationResult} = require('express-validator');

//importing our models (schemas) we define in our mongo client
const Book = require('../models/book');
const Author = require('../models/author');

//defining our addBook function to handle the way we create each book
exports.addBook = async (req , res , next) => {
    //check if the validation result contains error and if so, throw an error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg);
        error.status = 422;
        throw error;
    }

    //check if the entered author is an existing author and if not, throw an error
    const author = await Author.findOne({name: req.body.author});
    if(!author){
        const error = new Error('sorry no author was found with name "'+req.body.author+'"!!!please define the author and then comeback');
        error.status = 404;
        throw error;
    }

    //check if the user has uploaded a picture and if not, throw an error (books should have an cover iamge)
    if(!req.file){
        const error = new Error('SORRY no image was provided');
        error.status = 422;
        throw error;
    }
 
    const imageUrl = req.file.path;
    const title = req.body.title;
    const discription = req.body.discription;
    const publishedYear = req.body.publishedYear;
    const edition = req.body.edition ? Math.ceil(Math.abs(+req.body.edition)) : 1;

    //check if the book is already existing with such title && author && edition version and if so, throw an error
    const existingBook = await Book.findOne({title: title});
    if(existingBook && existingBook.author === author && existingBook.edition === edition){
        const error = new Error('book with this edition version already exists');
        error.status = 422;
        throw error;
    }

    //define our new book as a new Book object
    const book = new Book({
        title: title,
        author: author._id,
        discription: discription,
        publishedYear: publishedYear,
        edition: edition,
        imageUrl: 'images/' + imageUrl.split('\\')[1],
    })

    //save our book in the database's book collection
    const createdBook =  await book.save();

    //save our book into its own author collection 
    author.booksPublishedBy.push(book);

    //save changes in the database's author collection
    const savedAuthor = await author.save();
    
    //sending our response
    return res.status(201).json({
        message: "book added to the library successfully",
        book: createdBook
    })
}

//defining our editBook function to handle the way we edit each book
exports.editBook = async (req , res , next) => {
    //check if the validation result contains error and if so, throw an error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg);
        error.status = 422;
        throw error;
    }

    const bookId = req.params.bookId;
    const title = req.body.title;
    const discription = req.body.discription;
    const publishedYear = +req.body.publishedYear;
    const edition = Math.ceil(Math.abs(+req.body.edition)) || 1;
    const author = req.body.author;
    let imageUrl = req.body.imageUrl;

    //check if the entered author is an existing author and if not, throw an error
    const enteredAuthor = await Author.findOne({name: author});
    if(!enteredAuthor){
        const error = new Error('sorry , no author was found with name "' + author +'"!!! please create author first!');
        error.status = 422;
        throw error;
    }

    //check if the new image was uploaded and if so, the new image will be replaced Otherwise the old image will remain
    if(req.file){
        imageUrl = 'images/' + req.file.path.split('\\')[1];
    }

    //check if the previously stored image and newly uploaded image are equal and if not, we clear the old image
    if(book.imageUrl !== imageUrl){
        clearImage(book.imageUrl)
    }
    
    //in this step we clear the book from old author's records (we'll save updated book in authors records too , soon)
    const book = await Book.findById(bookId);
    const prevSavedAuthor = await Author.findById(book.author);
    prevSavedAuthor.booksPublishedBy.pull(bookId)
    const updatedPrevSavedAuthor = await prevSavedAuthor.save();


    //updating the book
    book.author = enteredAuthor._id;
    book.title = title;
    book.discription = discription;
    book.publishedYear = publishedYear;
    book.edition = edition;
    book.imageUrl = imageUrl;

    //save our updated book in the database's book collection
    const updatedBook = await book.save();

    //saving our updated book in the author's collection records
    enteredAuthor.booksPublishedBy.push(updatedBook);
    const updatedNewAuthor = await enteredAuthor.save();

    //sending our response
    return res.status(200).json({
        message: "the book was successfully updated" ,
        book: updatedBook
    })
}

//defining our deleteBook function to handle the way we delete each book
exports.deleteBook = async (req , res , next) => {
    const bookId = req.params.bookId;

    //checking if the book we're looking for exists and if does not, throw error
    const book = await Book.findById(bookId);
    if(!book){
        const error = new Error('book was noy=t found!');
        error.status = 404;
        throw error;
    }

    //finding the author of the book and update its records by removing the book we're trying to delete
    const authorOfTheBook = await Author.findById(book.author);
    authorOfTheBook.booksPublishedBy.pull(bookId);
    const savedAuthor = await authorOfTheBook.save();

    //clear the image of the book that we're trying to delete
    clearImage(book.imageUrl);

    //deleting the book and saving the changes
    const deletedBook = await Book.findByIdAndRemove(bookId);
    
    //sending our response
    return res.status(200).json({
        message: 'book was deleted successfully'
    })
}

//author-related functions

//defining our addAuthor function to handle the way we create each author
exports.addAuthor = async (req , res , next) => {
    //check if the validation result contains error and if so, throw an error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg);
        error.status = 422;
        throw error;
    }

    const name = req.body.name;
    const bio = req.body.bio;
    const bornYear =  req.body.bornYear;

    //authors don't have to have image all the time and for those who don't, we store 'none' as the imageUrl
    const imageUrl = req.file ? req.file.path : 'none';

    //check if the author is already existing with such name && bornYear and if so, throw an error
    const existingAuthor = await Author.findOne({name: name});
    if(existingAuthor && existingAuthor.bornYear === bornYear){
        const error = new Error('author already exists');
        error.status = 422;
        throw error;
    }

    //declaring our new Author instance
    const author = new Author({
        name: name,
        bio: bio,
        bornYear: bornYear,
        booksPublishedBy: [],
        imageUrl: imageUrl
    })

    //save changes in Author's collection
    const createdAuthor = await author.save();

    //sending our response
    return res.status(201).json({
        message: "the author was created successfully",
        author: createdAuthor
    })

}

//defining our editAuthor function to handle the way we edit each author
exports.editAuthor = async (req , res , next) => {
    //check if the validation result contains error and if so, throw an error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg);
        error.status = 422;
        throw error;
    }

    const authorId = req.params.authorId;

    //check if the author we're trying to edit is alreay exists and if not, throw an error
    const author = await Author.findById(authorId);
    if(!author){
        const error = new Error('sorry author was not found')
        error.status = 404;
        throw error;
    }

    const name = req.body.name;
    const bio = req.body.bio;
    const bornYear =  req.body.bornYear;
    let imageUrl = req.body.imageUrl;

    //checking if the user has uploaded an image and if so, we store it in imageUrl
    if(!req.file){
        imageUrl = 'images/' + req.file.path.split('\\')[1];
    }

    //checking if the new imageUrl is equal to the old one and if not, clearing the old image
    if(imageUrl !== author.imageUrl && author.imageUrl !== 'none'){
        clearImage(book.imageUrl)
    }

    //updating the author
    author.name = name;
    author.bio = bio;
    author.bornYear = bornYear;
    author.imageUrl = imageUrl;

    //saving the changes in the Author's collection
    const updatedAuthor = await author.save();

    //sending our response
    return res.status(200).json({
        message: 'the author info was updated successfully',
        author: updatedAuthor
    })
}

//defining our deleteAuthor function to handle the way we delete each author
exports.deleteAuthor = async (req , res , next) => {
    const authorId = req.params.authorId;

    //check if the author we're trying to delete is alreay exists and if not, throw an error
    const author = await Author.findById(authorId);
    if(!author){
        const error = new Error('sorry no author was found');
        error.status = 404;
        throw error;
    }

    //deleting all the dependencies of the author we're trying to delete
    author.booksPublishedBy.forEach(async function(bookItem){
        const bookWeAreLookingFor = await Book.findById(bookItem);
        clearImage(bookWeAreLookingFor.imageUrl);
        const deletedBook = await Book.findByIdAndRemove(bookItem);
    });

    //deleting the author image if it exists
    if(author.imageUrl !== 'none'){
        clearImage(author.imageUrl);
    }

    //saving the changes in the Author's collection
    const deletedAuthor = await Author.findByIdAndRemove(authorId);
    
    //sending responses
    return res.status(200).json({
        message: 'author was removed from list successfully'
    })
}

//defining an function in order to delete images from the file system
const clearImage = filePath => {
    filePath = path.join(__dirname , '..' , filePath);
    fs.unlink(filePath , err => console.log(err));
}