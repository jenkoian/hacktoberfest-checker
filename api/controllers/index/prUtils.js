'use strict';

const _ = require('lodash');
const moment = require('moment');

let pullRequestData = [];

function getNextPage(response, github) {
    const promise = new Promise(function(resolve, reject) {
        github.getNextPage(response, function(err, res) {
            if (err) {
                reject();
                return false;
            }

            pullRequestData = pullRequestData.concat(res['data'].items);
            if (github.hasNextPage(res)) {
                getNextPage(res, github).then(function () {
                    resolve();
                });
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Found ' + pullRequestData.length + ' pull requests.');
                }
                resolve();
            }
        });
    });
    return promise;
}

function loadPrs(github, username) {
    const promise = new Promise(function(resolve, reject) {
        var today = new Date();
        var curmonth = today.getMonth();
        var curyear = today.getFullYear();
        var searchyear = curyear;
        if (curmonth < 9) {
            searchyear = curyear - 1;
        }
        github.search.issues({
            q: `-label:invalid+created:${searchyear}-09-30T00:00:00-12:00..${searchyear}-10-31T23:59:59-12:00+type:pr+is:public+author:${username}`,
            per_page: 100  // 30 is the default but this makes it clearer/allows it to be tweaked
        }, function(err, res) {
            if (err) {
                reject();
                return false;
            }

            pullRequestData = pullRequestData.concat(res['data'].items);
            if (github.hasNextPage(res)) {
                getNextPage(res, github).then(function () {
                    resolve();
                });
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Found ' + pullRequestData.length + ' pull requests.');
                }
                resolve();
            }
        });
    });

    return promise;
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
