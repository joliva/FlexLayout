var frag;

// create layer
var layout = $.flexlayout.createLayout();

// create fragment specifying everything
var view1 = Ti.UI.createView();

layout.addFragSpec({
	name: 'view1',
	pos: [1,1],
	span: [1,3],
	props: {
		backgroundColor: 'blue'
	},
	view: view1
});

// create fragment with auto creation of view
layout.addFragSpec({
	name: 'view2',
	pos: [0,0],
	span: [1,1],
	props: {
		backgroundColor: 'red'
	}
}, layout.DefaultLayer);

// data driven fragment creation
var specs = [
    {name: 'view3', pos: [2,0], span: [1,1], props: {backgroundColor: 'green'}},
	{name: 'view4', pos: [1,0], span: [1,1], props: {backgroundColor: 'silver'}},
	{name: 'view5', pos: [0,2], span: [2,4]},
];
for (var i=0, l=specs.length; i<l; i++) {
	layout.addFragSpec(specs[i]);
}

layout.compose();

// accessing view from last created fragment to add web view
var web = Ti.UI.createWebView({
	url: 'http://olivalabs.com',
	borderWidth: 1,
	borderColor: '#ddd',
	scalesPageToFit: true
});

layout.getFragment('view5').getView().add(web);

$.index.open();
