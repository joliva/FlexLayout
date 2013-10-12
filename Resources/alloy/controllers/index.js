function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        top: Alloy.CFG.winTopOffset,
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.flexgrid = Alloy.createWidget("FlexGrid", "widget", {
        id: "flexgrid",
        rows: "4",
        cols: "4",
        __parentSymbol: $.__views.index
    });
    $.__views.flexgrid.setParent($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var view1 = Ti.UI.createView({
        backgroundColor: "red"
    });
    var view2 = Ti.UI.createView({
        backgroundColor: "blue"
    });
    var view3 = Ti.UI.createView({
        backgroundColor: "green"
    });
    var view4 = Ti.UI.createView({
        backgroundColor: "silver"
    });
    var view5 = Ti.UI.createView({
        backgroundColor: "olive"
    });
    $.flexgrid.addView(view1, [ 0, 0 ], [ 1, 1 ]);
    $.flexgrid.addView(view2, [ 1, 1 ], [ 1, 2 ]);
    $.flexgrid.addView(view3, [ 2, 0 ], [ 1, 1 ]);
    $.flexgrid.addView(view4, [ 1, 0 ], [ 1, 1 ]);
    $.flexgrid.addView(view5, [ 0, 2 ], [ 2, 4 ]);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;