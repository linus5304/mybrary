const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// All Authors Route
router.get('/', (req, res)=>{
    res.render('authors/index')
})


// New author Route
router.get('/new', (req, res)=>{
    res.render('authors/new', {author: new Author()})
})

// Creating author
router.post('/', (req, res)=>{
    const author = new Author({
        name : req.body.name,
    })
    author.save((err, newAuthor)=>{
        if(err){
            res.render('authors/new',{
                author: newAuthor,
                errorMessage: 'Error creating Author'
            })
        }else{
            // res.redirect(`authors/${newAuthor.id}`)
            res.redirect('authors')

        }
    })

})

module.exports = router