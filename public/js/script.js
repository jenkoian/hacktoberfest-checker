$(document).ready(function() {
    new HacktoberfestChecker().constructor();
});

function HacktoberfestChecker() {
    // DOM nodes cache
    this.username = $('input[name=username]');
    this.openIssues = $('#open-issues');
    this.form = $('form');
    this.results = $('#results');
    // some configurable error messages
    this.errors = {
        emptyUsername: "Username cannot be blank.",
        API: {
            issue: "An error occurred while fetching new issues, have you set your github token? ",
            username: "An error occurred while fetching issues for the given username, have you set your github token? "
        }
    };
    //the path for the spinner
    this.loader = "/img/ajax-loader.gif";
}
/**
 * in the constructor we'll initialize/retrieve everything that needs to fire when we new this object up
 */
HacktoberfestChecker.prototype.constructor = function() {
    this.setFocus();
    this.bindEvents();
    this.getNewIssues();
};
/**
 * the bind events function can be extended as the app grows
 */
HacktoberfestChecker.prototype.bindEvents = function() {
    this.form.on("submit", this.getUsernameIssues.bind(this));
};
/**
 * Set the focus on the username field
 */
HacktoberfestChecker.prototype.setFocus = function() {
    this.username.focus();
};
/**
 * API call to the backend to featch new issues
 */
HacktoberfestChecker.prototype.getNewIssues = function() {
    this.openIssues.html(this.makeSpinner());
    $.ajax({
        url: '/issues',
        type: "GET",
        success: this.newIssuesSuccess.bind(this),
        //new: add error handler in case of failure during the API call
        error: this.newIssuesError.bind(this)
    });
};
/**
 * In case of success during API call, display the HTML
 */
HacktoberfestChecker.prototype.newIssuesSuccess = function(html) {
    this.openIssues.html(html);
};
/**
 * In case of an error during API call, display an error message
 */
HacktoberfestChecker.prototype.newIssuesError = function(html) {
    this.openIssues.html(this.makeError(this.errors.API.issue));
};

HacktoberfestChecker.prototype.getUsernameIssues = function(e) {
    if (e) {
        e.preventDefault();
    }
    var name = this.getName();

    if (!name) {
        this.results.html(this.makeError(this.errors.emptyUsername));
        return;
    }
    this.results.html(this.makeSpinner());

    $.ajax({
        url: '/?username=' + name,
        type: "GET",
        success: this.usernameIssuesSuccess.bind(this),
        //new: add error handler in case of failure during the API call
        error: this.usernameIssuesError.bind(this),
        always: this.updateHistory.apply(this, [name])
    });

};

/**
 * In case of success during API call, display the HTML
 */
HacktoberfestChecker.prototype.usernameIssuesSuccess = function(html) {
    this.results.html(html);
};
/**
 * In case of an error during API call, display an error message
 */
HacktoberfestChecker.prototype.usernameIssuesError = function(html) {
    this.results.html(this.makeError(this.errors.API.username));
};

HacktoberfestChecker.prototype.getName = function() {
    return this.username.val() || false;
};
/**
 * HTML Helper makeSpinner
 * create the necessary HTML to show the spinner using fluent syntax
 */
HacktoberfestChecker.prototype.makeSpinner = function() {
    return $("<div/>", {
        class: "row"
    }).addClass('loading').append(
        $("<div/>", {
            class: "large-12 columns"
        }).append(
            $("<h2/>").append(
                $("<img/>", {
                    src: this.loader,
                    alt: "loading"
                })
            )
        )
    );
};
/**
 * HTML Helper makeSpinner
 * create the necessary HTML to show an error message using fluent syntax
 */
HacktoberfestChecker.prototype.makeError = function(error) {
    return $("<div/>", {
        class: "row"
    }).append(
        $("<div/>", {
            class: "large-12 columns"
        }).append(
            $("<h2/>", {
                text: error
            })
        )
    );
};
/**
 * History state helper, checks if the replaceState is available
 * before updating the username in the query string.
 */
HacktoberfestChecker.prototype.updateHistory = function(name) {
    if (window.history && window.history.replaceState) {
        history.replaceState({}, name, '?username=' + name);
    }
};
