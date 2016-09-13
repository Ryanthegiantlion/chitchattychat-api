var app = require('express')();
var bodyParser = require('body-parser');
var logger = require('./middleware/logger')
var cors = require('./middleware/cors')
var router = require('./routes/index')

app.use(logger);
app.use(cors);
app.use(bodyParser.json())
app.use('/', router)

var port = process.env.PORT || 8082;

app.listen(port, function(){
	console.log('api listening on *:' + port);
});