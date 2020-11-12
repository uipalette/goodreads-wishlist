const Book = require('../models/bookModel')

// @desc    Gets All Books
// @route   GET /api/books
async function getBooks(req, res) {
    try {
        const products = await Book.findAll()
        res.writeHead(200, { 
            'Content-Type' : 'application/json',
            'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            // 'Access-Control-Max-Age': 2592000,
         })
        res.end(JSON.stringify(products))
    } catch (error) {
        console.log(error)
    }
}

// @desc    Gets Single Book
// @route   GET /api/book/:id
async function getBookFromQuery(req, res, query) {
    try {
        const book = await Book.findByQuery(query)
        if(!book) {
            res.writeHead(404, { 'Content-Type' : 'application/json' })
            res.end(JSON.stringify({ message: 'Book Not Found'}))
        } else {
            res.writeHead(200, { 
                'Content-Type' : 'application/json' ,
                'Access-Control-Allow-Origin': '*',
            })
            res.end(JSON.stringify(book))
        }
    } catch(error) {
        console.log(error)
    }
}

module.exports = {
    getBooks,
    getBookFromQuery
}