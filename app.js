const fs = require('fs')
const zlib = require('zlib')

let readbleStream = fs.createReadStream('Hello.txt', 'utf-8')

let writebleStream = fs.createWriteStream('Hello.txt.gz')

let gzip = zlib.createGzip()

readbleStream.pipe(gzip).pipe(writebleStream)