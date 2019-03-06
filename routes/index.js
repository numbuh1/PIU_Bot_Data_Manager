var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://numbuh1:numbuh1@piu-bot-cluster-zgdrs.mongodb.net/test?retryWrites=true";

/* GET home page. */
router.get('/', function(req, res, next) {	
	res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Songlist page. */
router.get('/songs', function(req, res) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("piu_bot_database");
		dbo.collection("Songs").find({}).toArray(function(err, result) {
		if (err) throw err;
			res.render('songs', {
	            "songs" : result
	        });
			db.close();
		});
	});
});

/* GET Songlist data. */
router.get('/songlist', function(req, res) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("piu_bot_database");
		dbo.collection("Songs").find({}).toArray(function(err, result) {
			if (err) throw err;
			res.json(result);
			db.close();
		});
	});
});

/* POST to Add Song Service */
router.post('/addsong', function(req, res) {

	var songObj = {
		name: req.body.songName,
		artist: req.body.artist,
		bpm: req.body.bpm,
		type: req.body.songType,
		category: req.body.category,
		origin: {
			game: req.body.originGame,
			version: req.body.originVersion
		},
		image: req.body.image,
		visualizer: req.body.visualizer
	};

	MongoClient.connect(url, function(err, db) {
	if (err) throw err;
		var dbo = db.db("piu_bot_database");
		
		dbo.collection("Songs").insertOne(songObj, function(err, result) {
			if (err) throw err;
			console.log("1 document inserted");
			res.send(
		      (err === null) ? { msg: '' } : { msg: err }
		    );
			db.close();
		});
	});
});

/* GET Chartlist data. */
router.get('/chartlist/:id', function(req, res) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("piu_bot_database");
		var songId = mongoose.mongo.ObjectId(req.params.id);
		dbo.collection("Charts").find({ 'song': songId }).toArray(function(err, result) {
			if (err) throw err;
			res.json(result);
			db.close();
		});
	});
});

/* GET Chart data. */
router.get('/chart/:id', function(req, res) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("piu_bot_database");
		var chartId = mongoose.mongo.ObjectId(req.params.id);
		dbo.collection("Charts").findOne({ '_id': chartId }, function(err, result) {
			if (err) throw err;
			res.json(result);
			db.close();
		});
	});
});

/* POST to Add Chart Service */
router.post('/addchart', function(req, res) {

	var chartObj = {
		song: mongoose.mongo.ObjectId(req.body.song),
		type: req.body.chartType,
		level: req.body.level,
		stepmaker: req.body.stepmaker,
		requirement: req.body.requirement,
		origin: {
			game: req.body.originGame,
			version: req.body.originVersion
		}
	};

	MongoClient.connect(url, function(err, db) {
	if (err) throw err;
		var dbo = db.db("piu_bot_database");
		
		dbo.collection("Charts").insertOne(chartObj, function(err, result) {
			if (err) throw err;
			console.log("1 chart inserted");
			res.send(
		      (err === null) ? { msg: '' } : { msg: err }
		    );
			db.close();
		});
	});
});

/* POST to Edit Chart Service */
router.post('/editchart/:id', function(req, res) {

	var chartId = mongoose.mongo.ObjectId(req.params.id);

	var chartObj = {
		type: req.body.chartType,
		level: req.body.level,
		stepmaker: req.body.stepmaker,
		requirement: req.body.requirement,
		origin: {
			game: req.body.originGame,
			version: req.body.originVersion
		}
	};

	MongoClient.connect(url, function(err, db) {
	if (err) throw err;
		var dbo = db.db("piu_bot_database");
		
		dbo.collection("Charts").updateOne({ '_id': chartId }, { $set: chartObj }, function(err, result) {
			if (err) throw err;
			console.log("1 chart updated");
			res.send(
		      (err === null) ? { msg: '' } : { msg: err }
		    );
			db.close();
		});
	});
});

/* DELETE to Delete chart. */
router.delete('/deletechart/:id', function(req, res) {
	MongoClient.connect(url, function(err, db) {
	if (err) throw err;
		var dbo = db.db("piu_bot_database");
		var chartId = mongoose.mongo.ObjectId(req.params.id);

		dbo.collection("Charts").deleteOne({ '_id' : chartId }, function(err, result) {
			if (err) throw err;
			console.log("1 chart deleted");
			res.send(
		      (err === null) ? { msg: '' } : { msg: err }
		    );
			db.close();
		});
	});
});



module.exports = router;
