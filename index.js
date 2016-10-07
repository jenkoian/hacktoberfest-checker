var express = require('express');
var GitHubApi = require("github");
var _ = require('lodash');
var q = require('q');
var exphbs  = require('express-handlebars');
var cache = require('memory-cache');

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
var userImage;

function getPullRequests(username) {
    var deferred,
        options;

    deferred = q.defer();

    options = {
        q: 'created:2016-09-30T00:00:00-12:00..2016-10-31T23:59:59-12:00+type:pr+is:public+author:' + username
    };

    github.search.issues(options, function(err, res) {
        if (err) {
            deferred.reject();
            return;
        }

        userImage = null;

        _.each(res.items, function(event) {
            var repo = event.pull_request.html_url.substring(0, event.pull_request.html_url.search('/pull'));

            if (userImage == null) {
                userImage = event.user.avatar_url;
            }

            var hacktoberFestLabels = _.filter(event.labels, function(label) {
                return label.name.toLowerCase() === 'hacktoberfest';
            });

            var returnedEvent = {
                repo_name: repo,
                title: event.title,
                url: event.html_url,
                state: event.state,
                hasHacktoberFestLabel: hacktoberFestLabels.length > 0
            };

            octoberOpenPrs.push(returnedEvent);
        });

        deferred.resolve();
    });

    return deferred.promise;
}

var totalIssues = 0;
var octoberOpenIssues = [];

function getIssues(){
    var deferred = q.defer();

    var options = {
        q : 'type:issue+label:hacktoberfest+state:open',
        sort : 'created',
        order : 'desc'
    };

    github.search.issues(options, function(err, res) {
        if (err) {
            deferred.reject();
            return;
        }

        totalIssues = res.total_count;

        _.each(res.items, function(issue) {
            var issueUrl = issue.html_url;

            var repo_url = issueUrl.replace(/\/(issues)\/\d+/, "");
            var lastSlash = repo_url.lastIndexOf("/");
            var repo = repo_url.substring(repo_url.lastIndexOf("/", lastSlash - 1) + 1);

            var description = issue.body;
            if (description.length > 500) {
                description = description.substring(0, 120) + "...";
            }

            var returnedIssue = {
                repo_url: repo_url,
                repo_name: repo,
                title: issue.title,
                url: issue.html_url,
                labels: issue.labels,
                description: description,
                created: issue.created_at,
                avatar: issue.user.avatar_url
            };

            octoberOpenIssues.push(returnedIssue);
        });

        deferred.resolve();
    });

    return deferred.promise;
}

app.get('/', function(req, res) {
    if (!req.query.username) {
        return res.render('index');
    }

    getPullRequests(req.query.username).then(function() {
        var length,
            statements;

        length = octoberOpenPrs.length;
        statements = ["It's not too late to start!", "Keep going.", "Half way there.", "So close!", "Way to go!", "Now you're just showing off."];
        if (length > 5) length = 5;

        if (req.xhr) {
          res.render('partials/prs', {prs: octoberOpenPrs, statement: statements[length], userImage: userImage});
        } else {
          res.render('index', {prs: octoberOpenPrs, statement: statements[length], username: req.query.username, userImage: userImage});
        }

        octoberOpenPrs = [];
    }).catch(function() {
        if (req.xhr) {
            res.render('partials/error');
        } else {
            res.render('index', {error: true, username: req.query.username});
        }

        octoberOpenPrs = [];
    });
});

app.get('/issues', function (req, res) {
    getIssues().then(function () {
        if (req.xhr) {
            res.render('partials/issues', {issues: octoberOpenIssues, total: totalIssues});
        } else {
            res.render('partials/error');
        }

        octoberOpenIssues = [];
    }).catch(function () {
        res.render('partials/error');
        octoberOpenIssues = [];
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
