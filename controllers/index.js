'use strict';

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
            const user     = gitData[1];

            const prs = [];

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
                    user: {
                        login: event.user.login,
                        url: event.user.html_url
                    }
                };

                prs.push(returnedEvent);
            });
            
            deferred.resolve({ prs, user });
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

        if (req.xhr) {

            res.render('partials/prs', {
                prs: data.prs,
                statement: statements[length],
                username: req.query.username,
                userImage: data.user.data.avatar_url,
                layout: false
            });
        } else {
            res.render('index', {
                prs: data.prs,
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
