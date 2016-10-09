$(document).ready(function() {
    var prevName;

    $('input[name=username]').focus();

    $('form').on('submit', function(e) {
        var name = $('input[name=username]').val();

        if (name == '') {
            $('#results').html('<div class="row"><div class="large-12 columns"><h2>Username cannot be blank.</h2></div></div>');
        } else {
            showLoading();

            getUserData(name, function (html) {
                $('#results').html(html);

                if (name !== prevName && window.history && window.history.pushState) {
                    prevName = name;
                    history.pushState({ name: name }, name, '?username=' + name);
                }
            });
        }
        e.preventDefault();
    });

    // start fetching new issue once the page is loaded
    $.get('/issues', function (html) {
        $('#open-issues').html(html);
    });
});

window.addEventListener('popstate', function(e) {
    var name = e.state ? e.state.name : '';

    $('input[name=username]').val(name);

    if (name) {
        showLoading();

        getUserData(name, function (html) {
            $('#results').html(html);
        });
    } else {
        $('#results').html('');
    }
});

// fetch user data
function getUserData(username, callback) {
    $.get('/?username=' + username, callback);
}

// display loading
function showLoading() {
    $('#results').html('<div class="text-center"><img src="/img/ajax-loader.gif" alt="loading"></div>');
}