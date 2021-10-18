

module.exports.date = function() {
    var options = {year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit" };
    var today  = new Date();

    return today.toLocaleDateString("en-US", options);
}









