const Author = require('../models/authors');
const { render } = require('ejs');
const express = require('express');
const router = express.Router()


//  All authors route
router.get('/', (req, res) =>{
    res.render('authors/index')
})

// New Author Route

router.get('/new',(req, res) =>{
    res.render('authors/new', {author: new Author()})
})

// create author route
router.post('/',(req, res) =>{
    const author = new Author({
        name: req.body.name
    })
    author.save((err, newAuthor) =>{
        if(err){
            res.render('authors/new', {
                author: author,
                errorMessage: "Error creating Author"
            })
        }else{
            // res.redirect(`authors/${newAuthor.id}`)
            res.redirect('authors')
        }
    })
    res.send(req.body.name)
}) 
module.exports = router