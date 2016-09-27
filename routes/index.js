var express = require('express');
var mongoose = require('mongoose');
var redis = require('redis');
var User = require('../models/user')

var router = express.Router();
var mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
console.log('monourl: ' + mongoUrl)

// TODO: Should we be connecting here?
mongoose.connect(mongoUrl)

var redisPub = redis.createClient(process.env.REDIS_URL);
var redisData = redis.createClient(process.env.REDIS_URL);

function getChatId(userId1, userId2)
{
  return userId1 < userId2 ? userId1 + userId2 : userId2 + userId1;
}

router.route('/users')
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err) return res.send(500, { error: err });

			var requestingUserId = req.get('UserId');
			var usersWithChatIds = users.map((item) => Object.assign(item.toJSON(), {chatId: getChatId(item._id, requestingUserId)}))
			res.json(usersWithChatIds)
		});
	})
	.post(function(req, res){
		console.log('getting user post')
		console.log(req.body);
		var query = {'userName':req.body.userName.toLowerCase()};
		
		var doc = {'userName':req.body.userName.toLowerCase()};
		if (req.body.pushToken) {
			doc.pushToken = req.body.pushToken;
			doc.platform = req.body.platform;
		}

		console.log(doc)
		User.findOneAndUpdate(query, doc, {new: true, upsert:true}, function(err, doc){
    	if (err) return res.send(500, { error: err });
    	
    	res.json(doc);
		});
	});

// TODO: Implement
// Do we want to call these groups rather?
router.route('/channels')
	.get(function(req, res) {
		res.json([{id:"0"},{groupName:"General"}]);
	})
	.post(function(req, res){
		res.json([{username:"0"},{username:"General"}]);
	});

module.exports = router;

