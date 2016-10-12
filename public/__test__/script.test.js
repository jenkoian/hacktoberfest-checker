const html = require('fs').readFileSync('./../views/index.hbs').toString();
document.documentElement.innerHTML = html;
const HacktoberfestChecker = require("../js/script");
const $ = require('./../../bower_components/jquery/dist/jquery.min');
window.$ = $;
const instance = new HacktoberfestChecker();

describe('HacktoberfestChecker', function() {
    it('Function Exists', function() {
        expect(typeof HacktoberfestChecker === "function").toBeTruthy();
    });
    it("default properies are set", function() {
        var objProperties = Object.getOwnPropertyNames(instance);
        var properties = objProperties.map(function(v) {
            var out = {};
            out[v] = instance[v];
            if (out[v]instanceof $) {
                out[v] = {
                    "isjQuery": true,
                    "length": out[v].length
                };
            } else {
                out[v] = JSON.stringify(out[v]);
            }
            return out;
        });
        expect(properties).toMatchSnapshot();
    });
    it('constructor does not throw errors', function() {
        try {
            HacktoberfestChecker.prototype.constructor.call(instance);
            expect(true).toBeTruthy();
        } catch (exc) {
            expect(exc).toBeFalsy();
        }
    });
});
describe('HTML', function() {
    describe('Error markup', function() {
        var errorMessage = HacktoberfestChecker.prototype.makeError.call(instance);
        it('is jQuery Object', function() {
            expect(errorMessage instanceof $).toBeTruthy();
        });

        it('is approved markup', function() {
            expect(errorMessage.html()).toMatchSnapshot();
        });
    });
    describe('Spinner markup', function() {
        var spinner = HacktoberfestChecker.prototype.makeSpinner.call(instance);
        it('is jQuery Object', function() {
            expect(spinner instanceof $).toBeTruthy();
        });

        it('is approved markup', function() {
            expect(spinner.html()).toMatchSnapshot();
        });
    });
});
describe('DOM', function() {
    describe('username field focus', function() {
        HacktoberfestChecker.prototype.setFocus.call(instance);
        it('has focus', function() {
            expect(instance.username.is(":focus")).toBeTruthy();
        });
    });
    describe('events bind', function() {
        HacktoberfestChecker.prototype.bindEvents.call(instance);
        it('submit form', function() {
            expect($._data(instance.form.get(0), "events").hasOwnProperty("submit")).toBeTruthy();
        });
    });
    describe('get username value', function() {
        it('if empty is false', function() {
            instance.username.val("");
            var emptyUsername = HacktoberfestChecker.prototype.getName.call(instance, "Testing!");
            expect(emptyUsername).toBeFalsy();
        });
        it('if filled is string', function() {
            var testValue = "Testing!";
            instance.username.val(testValue);
            var username = HacktoberfestChecker.prototype.getName.call(instance, "Testing!");
            expect(username).toBe(testValue);
        });
    });
});

describe('API', function() {
    describe('October PRs', function() {
        it("success message", function() {
            HacktoberfestChecker.prototype.newIssuesSuccess.call(instance, "Testing!");
            expect(instance.openIssues.html()).toMatchSnapshot();
        });
        it("error message", function() {
            HacktoberfestChecker.prototype.newIssuesError.call(instance);
            expect(instance.openIssues.html()).toMatchSnapshot();
        });
    });
    describe('Username PRs', function() {
        it("success message", function() {
            HacktoberfestChecker.prototype.usernameIssuesSuccess.call(instance, "Testing!");
            expect(instance.openIssues.html()).toMatchSnapshot();
        });
        it("error message", function() {
            HacktoberfestChecker.prototype.usernameIssuesError.call(instance);
            expect(instance.openIssues.html()).toMatchSnapshot();
        });
    });
});
