const AWS = require('aws-sdk')
const fs = require('fs')
require('dotenv').config({path: __dirname + '\\' + '.env' })
var path = require('path')


const s3 = new AWS.S3({
	accessKeyId : process.env.AWS_ACCESS_KEY,
	secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
	region : 'ap-northeast-2'
})

const s3Upload = async function(image)
{
	timestampSecond = Math.floor(+ new Date() / 1000);
	const ext = path.extname(image)
	let param = {
		'Bucket':'chium',
		'Key': `temp/admin-${timestampSecond}`+ ext,
		'ACL':'public-read',
		'Body':fs.createReadStream(image),
		'ContentType':'image/png'
	}
	s3.upload(param,function(err,data){
		if (data != null){
			console.log('successfully uploaded 🚀')
		}
		if (err != null){
			console.log('ERROR 💥')
			console.log(err)
		}	
	})
	return `https://chium.s3.ap-northeast-2.amazonaws.com/temp/admin-${timestampSecond}${ext}`
}



module.exports = {
	s3Upload
}