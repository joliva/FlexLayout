function isIOS7Plus() {
    var version = Titanium.Platform.version.split(".");
    var major = parseInt(version[0], 10);
    if (major >= 7) return true;
    return false;
}

var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

if (true == isIOS7Plus()) {
    Alloy.CFG.isIOS7Plus = true;
    var statusBarHeight = 20;
    Alloy.CFG.winTopOffset = statusBarHeight;
} else {
    Alloy.CFG.isIOS7Plus = false;
    Alloy.CFG.winTopOffset = 0;
}

Ti.UI.setBackgroundColor("#dcdcdc");

Alloy.createController("index");