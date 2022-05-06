var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const checkToken = require('./middlewares/auth')
var adminRouter = require('./router/admin');
const { secretKey } = require('./config/secretkey')
// const fileupload = require('express-fileupload')
var app = express();
var corsOptions = {
	"origin": "*",
	"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
	"preflightContinue": false,
	"optionsSuccessStatus": 200,
	"credential": true,
}





require("dotenv").config();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	secret :'team-leader',
	resave : false,
	saveUninitialized : false,
	cookie : {
		maxAge : null
		
	}
}))



app.get('/', (req,res)=>{
	res.send('welcome to home ✈')
	req.sessionStore.all((err,session)=>{
		console.log(session)
	})
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(fileupload())
app.use(cors(corsOptions));

app.use(checkToken);
app.use('/api/admin', adminRouter);

app.set('view engine', 'ejs'); //'ejs'탬플릿을 엔진으로 한다.
app.engine('html', require('ejs').renderFile);
const handleListening = () => {
	console.log("👀 server is listening on 3000 port🚀")
}
app.listen(3000, handleListening)
module.exports = app;