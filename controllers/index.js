'use strict';

const _ = require('lodash');
const moment = require('moment');


const statements = [
    'It\'s not too late to start!',
    'Off to a great start, keep going!',
    'Half way there, keep it up!',
    'So close!',
    'Way to go!',
    'Now you\'re just showing off!'
];

const errors = {
    notUser: 'Username must belong to a user account.'
};

const errorCodes = {
    notUser: 400
};

/**
 * GET /
 */
exports.index = (req, res) => {
    const github = req.app.get('github');
    const username = req.query.username;

    if (!username) {
        if (req.xhr) {
            return res.render('partials/error', { layout: false });
        }

        return res.render('index');
    }

    Promise.all([
        findPrs(github, username),
        github.users.getForUser({username})
            .then(logCallsRemaining)
    ])
        .then(([prs, user]) => {
            if (user.data.type !== 'User') {
                return Promise.reject('notUser');
            }

            const data = {
                prs,
                isNotComplete: prs.length < 4,
                statement: statements[prs.length < 5 ? prs.length : 5 ],
                username,
                userImage: user.data.avatar_url,
                hostname: `${req.protocol}://${req.headers.host}`
            };

            if (req.query['plain-data']) {
                res.render('partials/prs', _.assign(data, {layout: false}));
            } else {
                res.render('index', data);
            }
        }).catch((err) => {
            console.log(err);
            if (req.xhr) {
                const code = errorCodes[err] || 404;
                res.status(code).render('partials/error', {
                    layout: false, errorMsg: errors[err]
                });
            } else {
                res.render('index', {
                    error: true, errorMsg: errors[err], username
                });
            }
        });
};


let pullRequestData = [];

function getNextPage(response, github) {
    const deferred = Promise.defer();
    github.getNextPage(response, function(err, res) {
        if (err) {
            deferred.reject();
            return false;
        }

        pullRequestData = pullRequestData.concat(res['data'].items);
        if (github.hasNextPage(res)) {
            getNextPage(res, github).then(function () {
                deferred.resolve();
            });
        } else {
            console.log('Found ' + pullRequestData.length + ' pull requests.');
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function loadPrs(github, username) {
    const deferred = Promise.defer();
    github.search.issues({
        q: `-label:invalid+created:2017-09-30T00:00:00-12:00..2017-10-31T23:59:59-12:00+type:pr+is:public+author:${username}`,
        per_page: 100  // 30 is the default but this makes it clearer/allows it to be tweaked
    }, function(err, res) {
        if (err) {
            deferred.reject();
            return false;
        }

        pullRequestData = pullRequestData.concat(res['data'].items);
        if (github.hasNextPage(res)) {
            getNextPage(res, github).then(function () {
                deferred.resolve();
            });
        } else {
            console.log('Found ' + pullRequestData.length + ' pull requests.');
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function findPrs(github, username) {
    pullRequestData = [];
    return loadPrs(github, username, pullRequestData)
        .then(function() {
            pullRequestData = _.map(pullRequestData, event => {
                const repo = event.pull_request.html_url.substring(0, event.pull_request.html_url.search('/pull/'));
                const hacktoberFestLabels = _.some(event.labels, label => label.name.toLowerCase() === 'hacktoberfest');

                return {
                    has_hacktoberfest_label: hacktoberFestLabels,
                    number: event.number,
                    open: event.state === 'open',
                    repo_name: repo.replace('https://github.com/', ''),
                    title: event.title,
                    url: event.html_url,
                    created_at: moment(event.created_at).format('MMMM Do YYYY'),
                    user: {
                        login: event.user.login,
                        url: event.user.html_url
                    },
                };
            });
            return Promise.resolve(pullRequestData);
        }).then(prs => {
            const checkMergeStatus = _.map(prs, pr => {
                const repoDetails = pr.repo_name.split('/');
                const pullDetails = {
                    owner: repoDetails[0],
                    repo: repoDetails[1],
                    number: pr.number
                };

                return github.pullRequests.checkMerged(pullDetails)
                    .then(logCallsRemaining)
                    .then(res => res.meta.status === '204 No Content')
                    .catch(err => {
                        // 404 means there wasn't a merge
                        if (err.code === 404) {
                            return false;
                        }

                        throw err;
                    });
            });

            return Promise
                .all(checkMergeStatus)
                .then(mergeStatus => Promise.resolve(_.zipWith(prs, mergeStatus, (pr, merged) => _.assign(pr, {merged}))));
        });
}

const logCallsRemaining = res => {
    console.log('API calls remaining: ' + res.meta['x-ratelimit-remaining']);
    return res;
};

exports.me = (req, res) => {
    res.render('me');
};
