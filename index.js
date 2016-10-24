var express = require('express');
var GitHubApi = require("github");
var _ = require('lodash');
var q = require('q');
var exphbs  = require('express-handlebars');
var cache = require('memory-cache');
var marked = require('marked');

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
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.set('port', (process.env.PORT || 5000));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use('/normalize-css', express.static('bower_components/normalize-css'));
app.use('/foundation/css', express.static('bower_components/foundation/css'));
app.use('/foundation/js', express.static('bower_components/foundation/js'));
app.use(express.static('public'));

var github = new GitHubApi({
    version: "3.0.0",
    debug: false,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000,
    headers: {
        "user-agent": "Hacktoberfest Checker"
    }
});

if(process.env.GITHUB_TOKEN){
  github.authenticate({
      type: "oauth",
      token: process.env.GITHUB_TOKEN
  });
}else {
  console.log('No GITHUB_TOKEN specified, do so to increase rate limit');
}

var octoberOpenPrs = [];
var userImage;
var ISSUES_UPDATE_INTERVAL = 60000;
var ISSUES_DISPLAY_LIMIT = 20;
var clientList = [];

function getPullRequests(username) {
    var deferred,
        options;

    deferred = q.defer();

    options = {
        q: '-label:invalid+created:2016-09-30T00:00:00-12:00..2016-10-31T23:59:59-12:00+type:pr+is:public+author:' + username
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
var tempIssues = [];

function getIssues(){
    var deferred = q.defer();

    var options = {
        q : 'type:issue+label:hacktoberfest+state:open',
        sort : 'created',
        order : 'desc'
    };

    tempIssues = [];
    github.search.issues(options, function(err, res) {
        if (err) {
            deferred.reject();
            return;
        }

        totalIssues = res.total_count;

        var issuesLen = res.items.length;

        _.forEach(res.items, function(issue, k) {
            var issueUrl = issue.html_url;

            var repo_url = issueUrl.replace(/\/(issues)\/\d+/, "");
            var lastSlash = repo_url.lastIndexOf("/");
            var repo = repo_url.substring(repo_url.lastIndexOf("/", lastSlash - 1) + 1);

            var description = issue.body;
            var temp_desc = description;
            if (description.length > 500) {
                // Check if there is a link in the description
                // if it starts before 120 chars, we include the
                // whole link.
                var link_match = /\[.+\]\(.+\)/;
                var matched = description.match(link_match);
                var match_index = description.search(link_match);
                if (matched && match_index < 120) {
                    description = description.substring(0, match_index) + matched + "&hellip;";
                } else {
                    description = description.substring(0, 120) + "&hellip;";
                }
            }

            var returnedIssue = {
                repo_url: repo_url,
                repo_name: repo,
                title: issue.title,
                url: issue.html_url,
                labels: issue.labels,
                description: marked(description),
                created: issue.created_at,
                avatar: issue.user.avatar_url
            };

            addRepoLanguages(returnedIssue, (k === issuesLen - 1) ? deferred : false).then(function(readyissue) {
                tempIssues.push(readyissue);
            });
        });


    });

    return deferred.promise;
}

function addRepoLanguages(issue, parentPromise) {
    var deferred = q.defer();

    var repo = issue.repo_name.split("/");

    github.repos.get({
        user: repo[0],
        repo: repo[1]
    }, function(err, res) {
        if (err) {
            issue.language = false;
        } else {
            issue.language = res.language;
        }
        deferred.resolve(issue);
        if (parentPromise) {
            parentPromise.resolve();
        }
    });
    return deferred.promise;

}

app.get('/', function(req, res) {
    if (!req.query.username) {
        return res.render('index', {issues: octoberOpenIssues, total: totalIssues});
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

server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

io.on('connection', function (socket) {
    // Add new connection too client list
    clientList.push(socket);

    socket.on('disconnect', function() {
        // remove client from the list
        clientList.splice(clientList.indexOf(socket), 1);
    });

    socket.on('error', function() {
        // remove client from the list
        clientList.splice(clientList.indexOf(socket), 1);
    });
});

function getIssuesCycle() {
    getIssues().then(function() {
        // Render the partial then send the html through the socket.
        // Optimize this too only send the object.
        // Insert the newer list of issues in front.
        octoberOpenIssues = tempIssues.concat(octoberOpenIssues);
        octoberOpenIssues.sort(createdAtSort);

        octoberOpenIssues = octoberOpenIssues.filter(function (val, index, arr) {
            if (index < arr.length - 1) {
                //console.log(val.url === arr[index+1].url);
                return val.url !== arr[index+1].url;
            }
            return true;
        });

        // Limit issues to be rendered
        if (octoberOpenIssues.length > ISSUES_DISPLAY_LIMIT) {
            octoberOpenIssues.splice(ISSUES_DISPLAY_LIMIT - 1);
        }
        hbs.render('./views/partials/issues.hbs', {issues: octoberOpenIssues, total: totalIssues})
            .then(function(html) {
                // Update all clients
                io.sockets.emit('github-issues', {html: html});
            });
    }).catch(function(err) {
        io.sockets.emit('github-error', {error: true});
    });

    setTimeout(getIssuesCycle, ISSUES_UPDATE_INTERVAL);
}

function createdAtSort(a, b) {
    return new Date(a.created).valueOf() < new Date(b.created).valueOf() ? 1 : -1;
}

// Get initial data
getIssuesCycle();
