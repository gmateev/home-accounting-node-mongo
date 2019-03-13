$(document).ready(function() {
    $('#counterpart').select2({
        tags: true,
        multiple: false
    });
    $('#category').select2({
        tags: true,
        multiple: false
    });
    $('#tags').select2({
        tags: true,
        multiple: true
    })

    // pre fill counterparts
    $.ajax({
            url:'http://wbs-bg.ddns.net:5000/expenses/counterparts',
            contentType:'application/json'
        }
    ).then((data) => {
        const element = $("#counterpart");
        const results = data.results;
        console.log(results);
        results.forEach((item) => {
            element.append(buildOption(item)).val("").trigger('change');
        });
    });
// pre fill categories
    $.ajax({
            url:'http://wbs-bg.ddns.net:5000/expenses/categories',
            contentType:'application/json'
        }
    ).then((data) => {
        const element = $("#category");
        const results = data.results;
        console.log(results);
        results.forEach((item) => {
            element.append(buildOption(item)).val("").trigger('change');
        });
    }).catch((err) => console.log(err));
// pre fill tags
    $.ajax({
            url:'http://wbs-bg.ddns.net:5000/expenses/tags',
            contentType:'application/json'
        }
    ).then((data) => {
        const element = $("#tags");
        const results = data.results;
        console.log(results);
        results.forEach((item) => {
            element.append(buildOption(item)).val("").trigger('change');
        });
    }).catch((err) => console.log(err));
// Set current date to today
    $('#date').get(0).valueAsDate = new Date();
    $('[data-type="submit"]').click(() => {
        console.log($('form').serialize());
        $.ajax({
            url: 'http://wbs-bg.ddns.net:5000/expenses',
            method: 'POST',
            data: $('form').serialize()
        })
            .then(() => {
                window.location.reload();
            })
            .catch(err => alert(err.responseText));
        return false;
    });
});


/**
 * Builds the select2 option from the backend response
 * @param item
 * @returns {HTMLOptionElement}
 */
function buildOption(item) {
    return new Option(item.text, item.text, false, false);
}