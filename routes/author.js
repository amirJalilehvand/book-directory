//importing our requirements from our our 3rd party packages
const {Router} = require('express');

//importing our controller of this route
const authorController = require('../controllers/author')

const router = Router();

//handling incoming GET requests to the '/authors' route (getting all of the authors)
router.get('/authors' , authorController.getAuthors);

//handling incoming GET requests to the '/author/:authorId' route (getting a single author)
router.get('/authors/:authorId' , authorController.getAuthor);

module.exports = router;