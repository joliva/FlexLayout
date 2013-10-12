var view1 = Ti.UI.createView({backgroundColor: 'red'});
var view2 = Ti.UI.createView({backgroundColor: 'blue'});
var view3 = Ti.UI.createView({backgroundColor: 'green'});
var view4 = Ti.UI.createView({backgroundColor: 'silver'});
var view5 = Ti.UI.createView({backgroundColor: 'olive'});

$.flexgrid.addView(view1, [0,0], [1,1]);
$.flexgrid.addView(view2, [1,1], [1,2]);
$.flexgrid.addView(view3, [2,0], [1,1]);
$.flexgrid.addView(view4, [1,0], [1,1]);
$.flexgrid.addView(view5, [0,2], [2,4]);

$.index.open();
