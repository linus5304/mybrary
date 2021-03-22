const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Author = require("../models/author");
const router = express.Router();
const Book = require("../models/book");
const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});
// All books Route
router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte('publishDate', publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte('publishDate', publishedAfter)
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
  renderNewPage(res, new Book());
});

// create book route
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
  });
  try {
    var newBook = await book.save();
    // res.redirect(`books/${newBook}`)
    res.redirect("books");
  } catch (error) {
    if (book.coverImageName !== null) {
      removeBookCover(book.coverImageName);
    }

    renderNewPage(res, book, true);
  }
});

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = "Error creating Book";
    res.render("books/new", params);
  } catch {
    res.redirect("books");
  }
}

module.exports = router;
