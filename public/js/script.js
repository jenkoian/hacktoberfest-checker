$(document).ready(function() {

    $('input[name=username]').focus();

    $('form').on('submit', function(e) {
        var name = $('input[name=username]').val();

        if(name == '') {
            $('#results').html('<div class="row"><div class="large-12 columns"><h2>Username cannot be blank.</h2></div></div>');
        }
        else {
            $('#results').html('<div class="row"><div class="large-12 columns"><h2><img src="/img/ajax-loader.gif" alt="loading" /></h2></div></div>');
            $.get('/?username=' + name, function (html) {
                $('#results').html(html);
                if (window.history && window.history.replaceState) {
                  history.replaceState({}, name, '?username=' + name);
                }
            });
        }
        e.preventDefault();
    });

    //start fetching new issue once the page is loaded
    $('#open-issues').html('<div class="row"><div class="large-12 columns"><h2><img src="/img/ajax-loader.gif" alt="loading" /></h2></div></div>');
    $.get('/issues', function (html) {
        $('#open-issues').html(html);
    });
});