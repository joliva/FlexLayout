function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "FlexGrid/" + s : s.substring(0, index) + "/FlexGrid/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isClass: true,
    priority: 10000.0002,
    key: "container",
    style: {
        height: Ti.UI.FILL,
        width: Ti.UI.FILL
    }
} ];