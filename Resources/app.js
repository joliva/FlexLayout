function isIOS7Plus() {
    return false;
}

var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var statusBarHeight;

Alloy.CFG.winTopOffset = 0;

Alloy.createController("index");