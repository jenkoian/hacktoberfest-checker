'use strict';
const moment = require('moment');
/**
 * GET /
 */
exports.index = (req, res) => {
    function findPrs(username) {
        const _ = req.app.get('_');
        const q = req.app.get('q');
        const github = req.app.get('github');

        const deferred = q.defer();

        const options = {
            q: `-label:invalid+created:2017-09-30T00:00:00-12:00..2017-10-31T23:59:59-12:00+type:pr+is:public+author:${username}`
        };

        q.all([
            github.search.issues(options),
            github.users.getForUser({ username })
        ]).then(gitData => {
            const foundPrs = gitData[0];
            const user = gitData[1];
            const prs = [];

            console.log('API calls remaining: ' + user.meta['x-ratelimit-remaining']);

            _.each(foundPrs.data.items, event => {
                const repo = event.pull_request.html_url.substring(0, event.pull_request.html_url.search('/pull'));

                const hacktoberFestLabels = _.filter(event.labels, label => label.name.toLowerCase() === 'hacktoberfest');

                const returnedEvent = {
                    has_hacktoberfest_label: hacktoberFestLabels.length > 0,
                    number: event.number,
                    open: event.state === 'open',
                    repo_name: repo.replace('https://github.com/', ''),
                    title: event.title,
                    url: event.html_url,
                    created_at: moment(event.created_at).format('MMMM Do YYYY'),
                    user: {
                        login: event.user.login,
                        url: event.user.html_url
                    }
                };

                prs.push(returnedEvent);
            });

            const requests = [];

            _.forEach(prs, pr => {
                const repoDetails = pr.repo_name.split('/');
                const pullDetails = {
                    owner: repoDetails[0],
                    repo: repoDetails[1],
                    number: pr.number
                };

                requests.push(github.pullRequests.checkMerged(pullDetails));
            });

            if (prs.length === 0) {
                deferred.resolve({ prs, user });
            }

            let resolvedCounter = 0;

            for (let i = 0; i < requests.length; i++) {
                requests[i].then(res => {
                    console.log('API calls remaining: ' + res.meta['x-ratelimit-remaining']);

                    if (res.meta.status === '204 No Content') {
                        prs[i].merged = true;
                    } else {
                        prs[i].merged = false;
                    }
                }).catch(err => {
                    // 404 means there wasn't a merge
                    if (err.code === 404) {
                        prs[i].merged = false;
                    } else {
                        deferred.reject(err);
                    }
                }).then(() => {
                    resolvedCounter++;

                    if (resolvedCounter === requests.length) {
                        deferred.resolve({ prs, user });
                    }
                });
            }
            
        }).catch(err => {
            deferred.reject(err);
        });

        return deferred.promise;
    }

    if (!req.query.username) {
        if (req.xhr) {
            return res.render('partials/error', { layout: false });
        }

        return res.render('index');
    }

    findPrs(req.query.username).then(data => {
        let length = data.prs.length;

        const statements = [
            'It\'s not too late to start!',
            'Off to a great start, keep going!',
            'Half way there, keep it up!',
            'So close!',
            'Way to go!',
            'Now you\'re just showing off!'
        ];

        if (length > 5) length = 5;
        
        if (req.query['plain-data']) {
            res.render('partials/prs', {
                prs: data.prs,
                isNotComplete: data.prs.length < 4,
                statement: statements[length],
                username: req.query.username,
                userImage: data.user.data.avatar_url,
                layout: false
            });
        } else {
            res.render('index', {
                prs: data.prs,
                isNotComplete: data.prs.length < 4,
                statement: statements[length],
                username: req.query.username,
                userImage: data.user.data.avatar_url
            });
        }
    }).catch(() => {
        if (req.xhr) {
            res.render('partials/error', {layout: false});
        } else {
            res.render('index', {error: true, username: req.query.username});
        }
    });
};
