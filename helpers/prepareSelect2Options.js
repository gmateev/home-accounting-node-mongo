const prepareSelect2Options = value => {
    let result = {
        "results": [

        ]
    }
    value.forEach((item, index) => {
        result.results.push({
            // id: index+1,
            text: item._id,
            selected: false
        });
    });
    return result;
}


module.exports = prepareSelect2Options;