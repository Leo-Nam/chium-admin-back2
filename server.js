const express = require('express')
const morgan = require('morgan')
const Pool = require('./pool');
const { s3Upload } = require('./s3.js');
const port = 3000;
//const cors = require('cors')
const logger = morgan('dev')
const server = express()
const adminRouter = require('./router/admin')
const handleListening = () => {
	console.log("👀 server is listening on 3000 port🚀")
}
s3Upload('./hi.png')
//server.use(cors())
server.use(logger)
server.get('/', (req,res)=>{
	res.send('welcome to home ✈')
})
server.use('/admin',adminRouter)
server.listen(port, handleListening)