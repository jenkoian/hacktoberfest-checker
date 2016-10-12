const HacktoberfestChecker = require("../js/script");
const $ = require('./../../bower_components/jquery/dist/jquery.min');
window.$ = $;
const instance = new HacktoberfestChecker();

describe('HacktoberfestChecker', function() {
    it('Function Exists', function() {
        expect(typeof HacktoberfestChecker === "function").toBeTruthy();
    });
    it('Properties are not empty', function() {
        for (property of Object.getOwnPropertyNames(instance)) {
            expect(instance[property]).toBeTruthy();
        }
    });
});
