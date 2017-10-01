'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
require('express-flash'); //assignment was never used
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const _ = require('lodash');
const q = require('q');
const GitHubApi = require('github');

// Load environment variables from .env file
dotenv.load();

// Controllers
const IndexController = require('./controllers/index');

const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	helpers: {
		ifeq: function(a, b, options) {
			if (a === b) {
				return options.fn(this);
			}
			return options.inverse(this);
		},
		toJSON : function(object) {
			return JSON.stringify(object);
		},
		exists: function (variable, options) {
			if (typeof variable !== 'undefined') {
				return options.fn(this);
			}
		},
		timeago: require('helper-timeago')
	},
	extname: 'hbs'
});

const github = new GitHubApi({
	version: '3.0.0',
	debug: false,
	protocol: 'https',
	host: 'api.github.com',
	timeout: 5000,
	headers: {
		'user-agent': 'Hacktoberfest Checker'
	}
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('port', process.env.PORT || 5000);
app.set('q', q);
app.set('_', _);
app.set('github', github);

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', IndexController.index);

// Production error handler
if (app.get('env') === 'production') {
	app.use(function(err, req, res) {
		console.error(err.stack);
		res.sendStatus(err.status || 500);
	});
}

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
