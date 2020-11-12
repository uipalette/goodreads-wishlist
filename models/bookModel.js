let books = require('../data/booksResponse')

function findAll() {
    return new Promise((resolve, reject) => {
        resolve(books.items)
    })
}

function findById(id) {
    return new Promise((resolve, reject) => {
        const book = books.items.find((b) => b.id == id)
        resolve(book)
    })
}

function findByQuery(query) {
    return new Promise((resolve, reject) => {
        const book = books.items.filter((book) => {
            let isFound = book.searchInfo.textSnippet.toLowerCase().indexOf(query.toLowerCase())
            if(isFound>0){
                return true
            } else {
                return false
            }
        })
        resolve(book)
    })
}

module.exports = {
    findAll,
    findById,
    findByQuery
};