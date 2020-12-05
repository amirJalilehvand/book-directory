//importing our requirements from our our 3rd party packages
const {Router} = require('express');

//importing our controller of this route
const bookController = require('../controllers/book');

const router = Router();

//handling incoming GET requests to the '/books' route (getting all of the books)
router.get('/books' , bookController.getBooks);

//handling incoming GET requests to the '/book/:bookId' route (getting a single book)
router.get('/books/:bookId' , bookController.getBook);

module.exports = router; 