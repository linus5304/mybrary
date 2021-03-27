const express = require("express");
const Author = require("../models/author");
const router = express.Router();
const Book = require("../models/book");
const imageMimeTypes = ["image/jpeg", "image/png", "/gif"];

// All books Route
router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishDate", publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publishDate", publishedAfter);
  }
  try {
    const books = await query.exec();

    res.render("books/index", {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});
// New book Route
router.get("/new", async (req, res) => {
  try{
    let authors = await Author.find()
    res.render('books/new', {book : new Book(), authors : authors})
  }catch{

  }
  
});

// create book route
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });

  saveCover(book, req.body.cover);
  try {
    var newBook = await book.save();
    res.redirect(`books/${newBook.id}`)
  } catch (error) {
    console.log(error);
    renderNewPage(res,book, true)
  }
});


// edit book Route
router.get("/:id/edit", async (req, res) => {
    try{
      const book = await Book.findById(req.params.id)
      renderEditPage(res,book, false)
      console.log(book)
    }catch{
      res.redirect('/')
    }
});

// Update book route
router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id) 
    book.title = req.body.title
    book.author = req.body.author
    book.publishDate = new Date(req.body.publishDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    if(req.body.cover != null && req.body.cover != ''){
      saveCover(book, req.body.cover)
    }
    res.redirect(`${book.id}`)
    await book.save()
  } catch {
    if(book != null){
      renderEditPage(res, book, true)
    }
    renderEditPage(res, book, true)
  }
});


// Show book route
router.get('/:id', async (req, res)=>{
  try{
    const book = await Book.findById(req.params.id).populate('author').exec()
    res.render('books/show', {book: book})
  }catch{
    res.redirect('/')
  }
})

// Delete book
router.delete('/:id', async (req, res)=>{
  let book 
  try{
    book = await Book.findById(req.params.id.trim())
    await book.remove()
    res.redirect('/books')
  }catch(err){
    console.log(err)
    if(book != null){
      res.render('books/show', {book: book, errorMessage: 'Could not remove book'})
    }else{
      res.redirect('/')
    }
  }
})




async function renderNewPage(res, book, hasError){
  renderFormPage(res, book, 'new', hasError = false)
}
async function renderEditPage(res, book, hasError){
  renderFormPage(res, book, 'edit', hasError = false)
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if(hasError){
      if(form === 'edit'){
        params.errorMessage = "Error updating Book";
      } else {
        params.errorMessage = "Error creating Book";
      }
    }
    res.render(`books/${form}`, params);
  } catch {
    res.redirect("books");
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = router;
