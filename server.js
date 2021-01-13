
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require("./routes/index")
const app =  express()



app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))



const mongoose = require('mongoose')
const dbUrl = require('./properties').DB_URL;

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true} );

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Conneted to Mongoose'))
app.use('/', indexRouter)
app.listen(process.env.PORT || 3000)


