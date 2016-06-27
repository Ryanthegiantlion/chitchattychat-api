var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	sender: String,
	receiver: String,
	text: String,
	timeStamp: Date
});


module.exports = mongoose.model('message', messageSchema)