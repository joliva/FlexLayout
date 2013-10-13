var frag;
var fragments = {};		// dictionary of fragments


// create fragment specifying everything
var view1 = Ti.UI.createView();

frag = $.flexgrid.createFragment({
	name: 'view1',
	pos: [0,0],
	span: [1,1],
	props: {
		backgroundColor: 'red'
	},
	view: view1
});
fragments[frag.name] = frag;

// create fragment with auto creation of view
frag = $.flexgrid.createFragment({
	name: 'view2',
	pos: [1,1],
	span: [1,2],
	props: {
		backgroundColor: 'blue'
	}
});
fragments[frag.name] = frag;

// separate creation and placement of fragment
frag = $.flexgrid.createFragment({
	name: 'view3',
	props: {
		backgroundColor: 'green'
	}
});
fragments[frag.name] = frag;
frag.place([2,0], [1,1]);

// data driven fragment creation
var layout = [
	{name: 'view4', pos: [1,0], span: [1,1], props: {backgroundColor: 'silver'}},
	{name: 'view5', pos: [0,2], span: [2,4]},
];
for (var i=0, l=layout.length; i<l; i++) {
	frag = $.flexgrid.createFragment(layout[i]);
	fragments[frag.name] = frag;
}

// accessing view from last created fragment to set background color
fragments['view5'].getView().backgroundColor = 'olive';

$.index.open();
