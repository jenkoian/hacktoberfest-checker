var github = require('./githubAuth');
var _ = require('lodash');
var q = require('q');

const userInfo = {
    username: null,
    octoberOpenPrs: [],
    userImage: null,

    resetToDefault: () => {
        userInfo.username = null;
        userInfo.octoberOpenPrs = [];
        userInfo.userImage = null;
        return;
    },

    setUserName: (username) => {
        userInfo.resetToDefault();
        userInfo.username = username;
        return;
    },

    populateOpenPrs: () => {
        var deferred = q.defer();

        var options = {
            q: '-label:invalid+created:2016-09-30T00:00:00-12:00..2016-10-31T23:59:59-12:00+type:pr+is:public+author:' + userInfo.username
        };

        github.search.issues(options, function(err, res) {
            if (err) {
                deferred.reject();
                return;
            }

            _.each(res.items, function(event) {
                var repo = event.pull_request.html_url.substring(0, event.pull_request.html_url.search('/pull'));

                if (userInfo.userImage == null) {
                    userInfo.userImage = event.user.avatar_url;
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

                userInfo.octoberOpenPrs.push(returnedEvent);
            });

            deferred.resolve();
        });

        return deferred.promise;
    }
}

module.exports = userInfo;