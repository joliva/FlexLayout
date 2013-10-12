function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "FlexGrid/" + s : s.substring(0, index) + "/FlexGrid/" + s.substring(index + 1);
    return path;
}

function Controller() {
    new (require("alloy/widget"))("FlexGrid");
    this.__widgetId = "FlexGrid";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.widget = Ti.UI.createView({
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "widget"
    });
    $.__views.widget && $.addTopLevelView($.__views.widget);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var TiGrid = require(WPATH("TiGrid"));
    var grid = new TiGrid({
        height: args.height || Ti.Platform.displayCaps.platformHeight,
        width: args.width || Ti.Platform.displayCaps.platformWidth,
        cols: args.cols || 3,
        rows: args.rows || 3,
        margin: args.margin || 0
    });
    $.addView = function(view, coord, span) {
        coord = coord || [ 0, 0 ];
        span = span || [ 1, 1 ];
        $.widget.add(view);
        grid.coord(coord[0], coord[1], {
            rowspan: span[0],
            colspan: span[1]
        }).position(view);
    };
    $.getRows = function() {
        return this.rows;
    };
    $.getCols = function() {
        return this.cols;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;