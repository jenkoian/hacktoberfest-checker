var express = require('express');
var GitHubApi = require("github");
var _ = require('lodash');
var q = require('q');
var exphbs  = require('express-handlebars');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.engine('hbs', exphbs({extname:'hbs'}));
app.set('view engine', 'hbs');

var github = new GitHubApi({
    version: "3.0.0",
    debug: true,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000,
    headers: {
        "user-agent": "Hacktoberfest Checker"
    }
});

github.authenticate({
    type: "oauth",
    token: process.env.GITHUB_TOKEN
});

var octoberOpenPrs = [];

function getUserEventForPage(username, pageNumber) {
    var deferred = q.defer();

    github.events.getFromUserPublic({
        user: username,
        page: pageNumber
    }, function(err, res) {

        if (err) {
            deferred.reject();
        }

        var prs = _.filter(res, { 'type': 'PullRequestEvent' }),
            openedPrs = _.filter(prs, {'payload': {action: "opened"}});

        _.filter(openedPrs, function(event) {
            return event.payload.pull_request.created_at.substr(0, 7) === '2015-10';
        }).forEach(function(event) {
            octoberOpenPrs.push(event);
        });

        deferred.resolve();
    });

    return deferred.promise;
}

app.get('/', function(req, res) {

    var promises = [];

    for (var i = 1; i <= 10; i++) {
        promises.push(getUserEventForPage(req.query.username, i));
    }

    q.all(promises).then(function() {
        res.render('index', {prs: octoberOpenPrs});
        octoberOpenPrs = [];
    }).catch(function() {
        res.render('index', {error: true});
        octoberOpenPrs = [];
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
