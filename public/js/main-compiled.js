'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
    module.exports = HacktoberfestChecker;
} else {
    $(document).ready(function () {
        new HacktoberfestChecker().constructor();
    });
}

function HacktoberfestChecker() {
    // DOM nodes cache
    this.username = $('input[name=username]');
    this.form = $('form');
    this.results = $('#results');
    // some configurable error messages
    this.errors = {
        emptyUsername: 'Username cannot be blank.',
        API: {
            issue: 'An error occurred while fetching new issues. Have you set your GitHub token? ',
            username: 'An error occurred while fetching issues for the given username. Have you set your GitHub token? '
        }
    };
    //the path for the spinner
    this.loader = '/img/ajax-loader.gif';
}
/**
 * in the constructor we'll initialize/retrieve everything that needs to fire when we new this object up
 */
HacktoberfestChecker.prototype.constructor = function () {
    this.setFocus();
    this.bindEvents();
    this.initialize();
};

HacktoberfestChecker.prototype.initialize = function () {
    if ($('#userImage').length) {
        this.userImageLazyLoad();
    }
};

HacktoberfestChecker.prototype.userImageLazyLoad = function () {
    var imageNode = $('#userImage');
    var imageElementInstance = new Image();
    imageElementInstance.onload = function () {
        imageNode.removeClass('o-0');
    };
    imageElementInstance.src = imageNode.attr('src');
};
/**
 * the bind events function can be extended as the app grows
 */
HacktoberfestChecker.prototype.bindEvents = function () {
    this.form.on('submit', this.getUsernameIssues.bind(this));
};
/**
 * Set the focus on the username field
 */
HacktoberfestChecker.prototype.setFocus = function () {
    this.username.focus();
};

HacktoberfestChecker.prototype.getUsernameIssues = function (e) {
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
        url: '/?username=' + name + '&plain-data=true',
        type: 'GET',
        success: this.usernameIssuesSuccess.bind(this),
        //new: add error handler in case of failure during the API call
        error: this.usernameIssuesError.bind(this),
        always: this.updateHistory.apply(this, [name])
    });
};

HacktoberfestChecker.prototype.loadSocialWidgets = function () {
    window.twttr.widgets.load();
    window.FB.XFBML.parse();
};

/**
 * In case of success during API call, display the HTML
 */
HacktoberfestChecker.prototype.usernameIssuesSuccess = function (html, textStatus, xhr) {
    this.results.html(html);
    this.loadSocialWidgets();

    if (xhr.status === 200) {
        this.userImageLazyLoad();
    }
};

/**
 * In case of an error during API call, display an error message
 */
HacktoberfestChecker.prototype.usernameIssuesError = function (xhr) {
    if (xhr.status >= 400) {
        this.results.html(xhr.response);
    } else {
        this.results.html(this.makeError(this.errors.API.username));
    }
};

HacktoberfestChecker.prototype.getName = function () {
    return this.username.val().trim() || false;
};
/**
 * HTML Helper makeSpinner
 * create the necessary HTML to show the spinner using fluent syntax
 */
HacktoberfestChecker.prototype.makeSpinner = function () {
    return $('<div/>').addClass('tc').append($('<img/>', {
        src: this.loader,
        alt: 'Loading...'
    }));
};
/**
 * HTML Helper makeSpinner
 * create the necessary HTML to show an error message using fluent syntax
 */
HacktoberfestChecker.prototype.makeError = function (error) {
    return $('<div/>').addClass('tc').append($('<h2/>', {
        text: error,
        class: 'white'
    }));
};
/**
 * History state helper, checks if the replaceState is available
 * before updating the username in the query string.
 */
HacktoberfestChecker.prototype.updateHistory = function (name) {
    if (window.history && window.history.replaceState) {
        history.replaceState({}, name, '?username=' + name);
    }
};

// Functions related to the personalization functions
function redirectToUserPage() {
    // Get the cached user.
    var me = localStorage.myGitHub;
    if (me) {
        window.location.href = '/?username=' + me;
    } else {
        window.location.href = '/'; // Username not saved, go to main page.
    }
}

function saveUserPage() {
    // Save username into localStorage. Recall username by visiting /me.
    localStorage.myGitHub = $('[name="username"]').val();
    // Provide some sort of visual feedback. Redirect to that page.
    window.location.href = '/me';
}

$(document).on('ready', function () {
    // Save is bound to button press
    $(document).on('click', '.saveUser', function () {
        return saveUserPage();
    });
    // Works with /me or /me/
    if (window.location.pathname.startsWith('/me')) {
        redirectToUserPage();
    }
});

//# sourceMappingURL=main-compiled.js.map