var express = require('express');
var mongoose = require('mongoose');
var redis = require('redis');
var User = require('../models/user')
var Message = require('../models/message')

var router = express.Router();
var mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
console.log('monourl: ' + mongoUrl)

// TODO: Should we be connecting here?
mongoose.connect(mongoUrl)

var redisPub = redis.createClient(process.env.REDIS_URL);
var redisData = redis.createClient(process.env.REDIS_URL);

router.route('/users')
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err) return res.send(500, { error: err });
			res.json(users)
		});
	})
	.post(function(req, res){
		// TODO we are not using this!
		var user = new User();
		//console.log(req.body)
		user.userName = req.body.userName.toLowerCase();
		
		// TODO:
		// Need to make sure we are returning the right one
		// Also dont return the query
		var query = {'userName':user.userName};
		User.findOneAndUpdate(query, query, {new: true, upsert:true}, function(err, doc){
    		if (err) return res.send(500, { error: err });
    		console.log(doc);
    		res.json(doc);
		});
});

// Not really using this yet.
// Modify if we want to allow creating of new channels etc
router.route('/channels')
	.get(function(req, res) {
		res.json([{username:"u1"},{username:"u2"}]);
	})
	.post(function(req, res){
		res.json([{username:"u1"},{username:"u2"}]);
	});

// TODO: Decide on whether we want to call these things channels or rooms
// Not using this yet in any of the clients
router.route('/rooms')
	.get(function(req, res) {
		res.json([{username:"u1"},{username:"u2"}]);
	})
	.post(function(req, res){
		res.json([{username:"u1"},{username:"u2"}]);
	});

// Atm all messages are created and received via the realtime api
// (except for unread messages below)
// Not using this in any of the clients
router.route('/messages')
	.get(function(req, res) {
		res.json([{message:"m1"},{message:"m2"}]);
	})
	.post(function(req, res){
		res.json([{message:"m1"},{message:"m2"}]);
	});

// Get all messages received since the last time stamp
// router.route('/messages/unread')
// 	.get(function(req, res) {
// 		var lastMessageTimeStamp = req.query.lastMessageTimeStamp;
// 		var userId = req.get('User-Id');
// 		redisData.lrange("directMessages:" + userId, 0, -1, function(err, data) {
// 		    if (err) return res.send(500, { error: err });
//     		var newMessages = data.map((item) => JSON.parse(item));
//     		if (newMessages.length > 0 && lastMessageTimeStamp) {
//     			if (lastMessageTimeStamp) {
//     				newMessages = newMessages.filter((item) => item.timestamp > lastMessageTimeStamp);
//     			}
//     		}
//     		res.json(newMessages);
// 		});
// 	});

module.exports = router;

