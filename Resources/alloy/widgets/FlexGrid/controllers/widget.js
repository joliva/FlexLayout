function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "FlexGrid/" + s : s.substring(0, index) + "/FlexGrid/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function Controller() {
    function Fragment(fragSpec) {
        _.extend(this, fragSpec);
        this.view = this.view || Ti.UI.createView();
        this.props && this.view.applyProperties(this.props);
        this.pos && this.span && this.draw();
    }
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
    $.widget.format = {};
    $.widget.format.ALL = 0;
    $.widget.format.HAND_PORT = 1;
    $.widget.format.HAND_LAND = 2;
    $.widget.format.TABLET_PORT = 3;
    $.widget.format.TABLET_LAND = 4;
    var grid = new TiGrid({
        height: args.height || Ti.Platform.displayCaps.platformHeight,
        width: args.width || Ti.Platform.displayCaps.platformWidth,
        cols: args.cols || 3,
        rows: args.rows || 3,
        margin: args.margin || 0
    });
    $.getDimension = function() {
        return [ this.rows, this.cols ];
    };
    $.createFragment = function(fragSpec) {
        fragSpec = fragSpec || {};
        var frag = new Fragment(fragSpec);
        $.widget.add(frag.view);
        return frag;
    };
    Fragment.prototype.getView = function() {
        return this.view;
    };
    Fragment.prototype.place = function(pos, span) {
        this.pos = pos || [ 0, 0 ];
        this.span = span || [ 1, 1 ];
        this.draw();
        return this;
    };
    Fragment.prototype.draw = function() {
        grid.coord(this.pos[0], this.pos[1], {
            rowspan: this.span[0],
            colspan: this.span[1]
        }).position(this.view);
        return this;
    };
    $.createLayout = function() {
        var v = view || Ti.UI.createView();
        var frag = new Fragment({
            view: v
        });
        $.widget.add(frag.view);
        return frag;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;