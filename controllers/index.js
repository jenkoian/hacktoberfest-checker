'use strict';

/**
 * GET /
 */
exports.index = (req, res) => {
    const prs = [];
    let userImage;

    function findPrs(username) {
        const _ = req.app.get('_');
        const q = req.app.get('q');
        const github = req.app.get('github');

        const deferred = q.defer();

        const options = {
            q: `-label:invalid+created:2017-09-30T00:00:00-12:00..2017-10-31T23:59:59-12:00+type:pr+is:public+author:${username}`
        };

        github.search.issues(options, (err, res) => {
            if (err) {
                deferred.reject();
                return;
            }

            userImage = null;

            _.each(res.data.items, event => {
                const repo = event.pull_request.html_url.substring(0, event.pull_request.html_url.search('/pull'));

                if (userImage == null) {
                    userImage = event.user.avatar_url;
                }

                const hacktoberFestLabels = _.filter(event.labels, label => label.name.toLowerCase() === 'hacktoberfest');

                const returnedEvent = {
                    repo_name: repo.replace('https://github.com/', ''),
                    title: event.title,
                    url: event.html_url,
                    open: event.state === 'open',
                    hasHacktoberFestLabel: hacktoberFestLabels.length > 0
                };

                prs.push(returnedEvent);
            });

            deferred.resolve();
        });

        return deferred.promise;
    }


    if (!req.query.username) {
        return res.render('index');
    }

    findPrs(req.query.username).then(() => {
        let length = prs.length;

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
            console.log(prs);
            res.render('partials/prs', {prs, statement: statements[length], userImage, layout: false});
        } else {
            res.render('index', {
                prs,
                statement: statements[length],
                username: req.query.username,
                userImage
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
