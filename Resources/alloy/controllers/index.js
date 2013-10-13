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
    var frag;
    var fragments = {};
    var view1 = Ti.UI.createView();
    frag = $.flexgrid.createFragment({
        name: "view1",
        pos: [ 0, 0 ],
        span: [ 1, 1 ],
        props: {
            backgroundColor: "red"
        },
        view: view1
    });
    fragments[frag.name] = frag;
    frag = $.flexgrid.createFragment({
        name: "view2",
        pos: [ 1, 1 ],
        span: [ 1, 2 ],
        props: {
            backgroundColor: "blue"
        }
    });
    fragments[frag.name] = frag;
    frag = $.flexgrid.createFragment({
        name: "view3",
        props: {
            backgroundColor: "green"
        }
    });
    fragments[frag.name] = frag;
    frag.place([ 2, 0 ], [ 1, 1 ]);
    var layout = [ {
        name: "view4",
        pos: [ 1, 0 ],
        span: [ 1, 1 ],
        props: {
            backgroundColor: "silver"
        }
    }, {
        name: "view5",
        pos: [ 0, 2 ],
        span: [ 2, 4 ]
    } ];
    for (var i = 0, l = layout.length; l > i; i++) {
        frag = $.flexgrid.createFragment(layout[i]);
        fragments[frag.name] = frag;
    }
    fragments["view5"].getView().backgroundColor = "olive";
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;