//importing our requirements from our our 3rd party packages
const {Router} = require('express');
const {check , body} = require('express-validator')

//importing our controller of this route
const adminController = require('../controllers/admin');

const router = Router();

//handling incoming POST requests to the '/admin/add-book' route
router.post('/add-book' , 
    //setting up some validation settings for our form
    [
        body('title' , 'title must at least contain 3 characters')
            .isLength({min: 3})
            .trim()
            .isString()
            ,
            body('discription' , 'discription must at least contain 2 alphabet')
            .trim()
            .isString()
            .isLength({min: 2})
            ,
            check('publishedYear')
            .isNumeric()
            .custom((value , {req})=> {
                if(+value > (new Date).getFullYear()){
                    throw new Error('invalid published year you entered')
                } else {
                    return true
                }
            })
            ,
            body('edition' , 'edition must be an integer number')
            .isNumeric()
    ]
    , adminController.addBook);

//handling incoming PUT requests to the '/admin/edit-book' route
router.put('/edit-book/:bookId' , 
    //setting up some validation settings for our form
    [
        body('title' , 'title must at least contain 3 characters')
            .isLength({min: 3})
            .isAlphanumeric()
            ,
            body('discription' , 'discription must at least contain 2 alphabet')
            .isLength({min: 2})
            .trim()
            .isString()
            ,
            check('publishedYear')
            .isNumeric()
            .custom((value , {req})=> {
                if(+value > (new Date).getFullYear()){
                    throw new Error('invalid published year you entered')
                } else {
                    return true
                }
            })
            ,
            body('edition' , 'edition must be an integer number')
            .isNumeric()
    ]
    , adminController.editBook);

//handling incoming DELETE requests to the '/admin/delete-book' route
router.delete('/delete-book/:bookId' , adminController.deleteBook);

//handling incoming POST requests to the '/admin/add-author' route
router.post('/add-author' , 
    //setting up some validation settings for our form
    [
        body('name' , 'name must at least contain 3 alphabets')
            .isLength({min: 3})
            .isString()
            .trim()
            ,
            body('bio' , 'bio must at least contain 8 characters')
            .isLength({min: 8})
            .trim()
            .isString()
            ,
            body('bornYear' , 'invalid born year')
            .trim()
            .isNumeric()
            .custom((value , {req}) => { 
                if(+value > (new Date).getFullYear()){
                    throw new Error('invalid born year you entered')
                } else {
                    return true
                }
            })
    ]
    , adminController.addAuthor);

//handling incoming PUT requests to the '/admin/edit-author' route
router.put('/edit-author/:authorId' , 
    //setting up some validation settings for our form
    [
        body('name' , 'name must at least contain 3 alphabets')
            .isLength({min: 3})
            .isString()
            .trim()
            ,
            body('bio' , 'bio must at least contain 8 characters')
            .isLength({min: 8})
            .trim()
            .isString()
            ,
            body('bornYear' , 'invalid born year')
            .trim()
            .isNumeric()
            .custom((value , {req}) => { 
                if(+value > (new Date).getFullYear()){
                    throw new Error('invalid born year you entered')
                } else {
                    return true
                }
            })
    ]
    , adminController.editAuthor);

//handling incoming DELETE requests to the '/admin/delete-author' route
router.delete('/delete-author/:authorId' , adminController.deleteAuthor)

module.exports = router;