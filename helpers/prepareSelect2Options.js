const prepareSelect2Options = value => {
    let result = {
        "results": [

        ]
    }
    console.log(value);
    value.forEach((item, index) => {
        result.results.push({
            // id: index+1,
            text: item,
            selected: false
        });
    });
    return result;
}


module.exports = prepareSelect2Options;