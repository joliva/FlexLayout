var frag;

// create layer
var layout = $.flexlayout.createLayout();

// create fragment specifying everything
var view1 = Ti.UI.createView();

layout.setFragSpec({
	name: 'view1',
	pos: [1,1],
	span: [2,6],
	props: {
		layout: 'vertical',
		backgroundColor: 'blue'
	},
	view: view1
});

// create fragment with auto creation of view
layout.setFragSpec({
	name: 'view2',
	pos: [5,5],
	span: [3,3],
	props: {
		backgroundColor: 'red'
	}
});

// data driven fragment creation
var specs = [
    {name: 'view3', pos: [2,0], span: [1,1], props: {backgroundColor: 'green'}},
	{name: 'view4', pos: [1,0], span: [1,1], props: {backgroundColor: 'silver'}}
];
for (var i=0, l=specs.length; i<l; i++) {
	layout.setFragSpec(specs[i]);
}

//create fragment associated with dynamic layer, aspect = orientation
/*
layout.setFragSpec({
	name: 'view5',
	pos: [0,3],
	span: [5,8],
});
*/
layout.setFragSpec({
	name: 'view5',
	pos: [0,3],
	span: [5,8],
}, layout.DynamicLayer, 'orientation', 'portrait');
layout.setFragSpec({
	name: 'view5',
	pos: [0,0],
	span: [8,4],
}, layout.DynamicLayer, 'orientation', 'landscape');

// create fragment associated with dynamic layer, aspect = orientation
layout.setFragSpec({
	name: 'view6',
	pos: [0,0],
	span: [1,1],
	props: {
		backgroundColor: 'black'
	}
}, layout.DynamicLayer, 'orientation', 'portrait');

layout.compose();

// accessing view from last created fragment to add web view
var web = Ti.UI.createWebView({
	url: 'http://olivalabs.com',
	borderWidth: 1,
	borderColor: '#ddd',
	scalesPageToFit: true
});
layout.getFragment('view5').getView().add(web);

var v1 = layout.getFragment('view1').getView();
v1.add(Ti.UI.createButton({
	top: '20dp',
	width: '50%',
	height: Ti.UI.SIZE,
	title: 'Button 1'
}));

v1.add(Ti.UI.createButton({
	top: '20dp',
	width: '50%',
	height: Ti.UI.SIZE,
	title: 'Button 2'
}));

layout.compose();

layout.setFragSpec({
	name: 'view2',
	pos: [0,0],
	span: [1,1],
	props: {
		backgroundColor: 'yellow'
	}
}, layout.StaticLayer, 'formFactor', 'handheld');

layout.compose();

layout.setFragSpec({
	name: 'view2',
	pos: [0,0],
	span: [1,1],
	props: {
		backgroundColor: 'olive'
	}
}, layout.DynamicLayer, 'orientation', 'portrait');

layout.compose();

$.index.open();
