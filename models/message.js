var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: Make this schema agnostic, separating meta data that should always be there
// e.g time stamps from data/ body
var messageSchema = new Schema({
	sender: String,
	receiver: String,
	text: String,
	timeStamp: Date
});

// var messageSchema = new Schema({
// 	{ any: Schema.Types.Mixed }
// });

module.exports = mongoose.model('message', messageSchema)