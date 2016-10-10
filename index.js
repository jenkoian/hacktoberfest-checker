var express = require('express');
var exphbs  = require('express-handlebars');
var cache = require('memory-cache');
var userInfo = require('./userInfo');
var hacktoberfest = require('./hacktoberfest');

var hbs = exphbs.create({
    helpers: {
        exists: function (variable, options) {
            if (typeof variable !== 'undefined') {
                return options.fn(this);
            }
        },

        timeago: require('helper-timeago')
    },
    extname: 'hbs'
});

var app = express();
app.set('port', (process.env.PORT || 5000));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use('/normalize-css', express.static('bower_components/normalize-css'));
app.use('/foundation/css', express.static('bower_components/foundation/css'));
app.use('/foundation/js', express.static('bower_components/foundation/js'));
app.use(express.static('public'));

app.get('/', function(req, res) {
    if (!req.query.username) {
        return res.render('index');
    }

    userInfo.setUserName(req.query.username);
    userInfo.populateOpenPrs(req.query.username).then(function() {
        var length,
        statements;

        length = userInfo.octoberOpenPrs.length;
        statements = ["It's not too late to start!", "Keep going.", "Half way there.", "So close!", "Way to go!", "Now you're just showing off."];
        if (length > 5) length = 5;

        if (req.xhr) {
          res.render('partials/prs', {prs: userInfo.octoberOpenPrs, statement: statements[length], userImage: userInfo.userImage});
      } else {
          res.render('index', {prs: userInfo.octoberOpenPrs, statement: statements[length], username: req.query.username, userImage: userInfo.userImage});
      }

      userInfo.resetToDefault();
    }).catch(function() {
        if (req.xhr) {
            res.render('partials/error');
        } else {
            res.render('index', {error: true, username: req.query.username});
        }
        userInfo.resetToDefault();
    });
});

app.get('/issues', function (req, res) {
    hacktoberfest.populateOpenIssues().then(function () {
        if (req.xhr) {
            res.render('partials/issues', {issues: hacktoberfest.octoberOpenIssues, total: hacktoberfest.totalIssues});
        } else {
            res.render('partials/error');
        }

        hacktoberfest.resetToDefault();
    }).catch(function () {
        res.render('partials/error');
        hacktoberfest.resetToDefault();
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
