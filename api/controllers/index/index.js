'use strict';

const _ = require('lodash');
const logCallsRemaining = require('./logCallsRemaining');
const {
  getNextPage,
  loadPrs,
  findPrs
} = require('./prUtils');

/**
 * GET /
 */
exports.index = (req, res) => {
    const github = req.app.get('github');
    const username = req.query.username;

    var hostname = process.env.APP_URL || `${req.protocol}://${req.headers.host}`;

    if (!username) {
      return res.status(400).json({
        error_description: 'No username provided!'
      });
    }

    Promise.all([
      findPrs(github, username),
      github.users.getForUser({ username })
        .then(logCallsRemaining)
    ])
        .then(([ prs, user ]) => {
            if (user.data.type !== 'User') {
                return Promise.reject('notUser');
            }

            const data = {
                prs,
                isNotComplete: prs.length < prAmount,
                statement: getStatement(prs),
                username,
                userImage: user.data.avatar_url,
                hostname: hostname,
                prAmount
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
                    hostname: hostname,
                    layout: false,
                    errorMsg: errors[err]
                });
            } else {
                res.render('index', {
                    hostname: hostname,
                    error: true,
                    errorMsg: errors[err],
                    username
                });
            }
        });
};
