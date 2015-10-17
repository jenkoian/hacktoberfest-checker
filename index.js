var express = require('express');
var GitHubApi = require("github");
var _ = require('lodash');
var q = require('q');
var exphbs  = require('express-handlebars');
var cache = require('memory-cache');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.engine('hbs', exphbs({extname:'hbs'}));
app.set('view engine', 'hbs');
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/normalize-css', express.static('bower_components/normalize-css'));
app.use('/foundation/css', express.static('bower_components/foundation/css'));
app.use('/foundation/js', express.static('bower_components/foundation/js'));

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
    var options = {
        user: username,
        page: pageNumber
    };
    if (cache.get('ETag?' + username + '&' + pageNumber) !== null) {
        options.headers = {
            "If-None-Match": cache.get('ETag?' + username + '&' + pageNumber)
        };
    }

    github.events.getFromUserPublic(options, function(err, res) {

        if (err) {
            deferred.reject();
            return;
        }

        if (res.meta.status.substr(0,3) === "304") {
            var knownPrs = cache.get('PullRequest?' + username + '&' + pageNumber);
            _.filter(knownPrs, function(event) {
                return event.payload.pull_request.created_at.substr(0, 7) === '2015-10';
            }).forEach(function(event) {
                octoberOpenPrs.push(event);
            });
            deferred.resolve();
            return;
        } else {
            cache.put('ETag?' + username + '&' + pageNumber, res.meta.etag);
        }

        var prs = _.filter(res, { 'type': 'PullRequestEvent' }),
            openedPrs = _.filter(prs, {'payload': {action: "opened"}});
        cache.put('PullRequest?' + username + '&' + pageNumber, openedPrs);

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

    if (!req.query.username) {
        return res.render('index');
    }

    for (var i = 1; i <= 10; i++) {
        promises.push(getUserEventForPage(req.query.username, i));
    }

    q.all(promises).then(function() {
        var length = octoberOpenPrs.length;
        var statements = ["It's not too late to start!", "You can do it.", "Half way there.", "Almost there!", "Way to go!", "Now you're just showing off."];
        if (length > 5) length = 5;

        res.render('index', {username: req.query.username, prs: octoberOpenPrs, statement: statements[length]});
        octoberOpenPrs = [];
    }).catch(function() {
        res.render('index', {username: req.query.username, error: true});
        octoberOpenPrs = [];
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
