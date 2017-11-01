// Replace node version in README.md
// We originally tried to use
// sed -i '' 's/v[^0-9]*[0-9]*[.][0-9]*[.][0-9]*[0-9A-Za-z-]*/'\"$(node -v)\"'/g' README.md
// But had trouble with the sed command on different platforms

'use strict';

const fs = require('fs');
const filePath = "README.md";

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    const result = data.replace(/Node v(\d+\.)?(\d+\.)?(\*|\d+)/, "Node " + process.version);
    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) {
           return console.log(err);
        };
    });
});
