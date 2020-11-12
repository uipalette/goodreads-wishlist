const http = require('http');
const { getBookFromQuery, getBooks } = require('./controllers/bookController')

const server = http.createServer((req,res)=>{
    if(req.url === '/api/books' && req.method === 'GET') {
        getBooks(req,res)
    } else if(req.url.match(/\/api\/book\/([a-z]+)/) && req.method === 'GET'){
        const query = req.url.split('/')[3]
        getBookFromQuery(req,res,query)
    } else {
        res.writeHead(404, { 'Content-Type' : 'application/json'})
        res.end(JSON.stringify({ message: 'Route Not Found' }))
    }
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`)) 