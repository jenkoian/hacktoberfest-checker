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
                res.status(404).render('partials/error', {layout: false});
            } else {
                res.render('index', {error: true, username});
            }
        });
};

function findPrs(github, username) {
    return github.search.issues({
        q: `-label:invalid+created:2017-09-30T00:00:00-12:00..2017-10-31T23:59:59-12:00+type:pr+is:public+author:${username}`
    })
        .then(prs => _.map(prs.data.items, event => {
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
        }))
        .then(prs => {
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
                .then(mergeStatus => 
                    _.zipWith(prs, mergeStatus, (pr, merged) => _.assign(pr, {merged})));
        });

}

const logCallsRemaining = res => {
    console.log('API calls remaining: ' + res.meta['x-ratelimit-remaining']);

    return res;
};

exports.me = (req, res) => {
    res.render('me');
};