'use strict';

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.set('port', port);

app.get('/*', function (req, res) {
    res.redirect(301, 'https://hacktoberfestchecker.jenko.me' + req.path)
});

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
