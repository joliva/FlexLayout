var frag;

// must open widget container (window) before creating fragments or a layout
$.index.addEventListener('open', function() {
	// create layer
	var layout = $.flexlayout.createLayout();

	// create fragment specifying everything
	var view1 = Ti.UI.createView();
	layout.setFragSpec({
		name: 'view1',
		props: {
			layout: 'vertical',
			backgroundColor: 'blue'
		},
		view: view1
	});
	layout.setFragSpec({
		name: 'view1',
		pos: [1,1],
		span: [2,6],
	}, layout.DynamicLayer, 'orientation', 'portrait');
	layout.setFragSpec({
		name: 'view1',
		pos: [4,0],
		span: [3,4],
	}, layout.DynamicLayer, 'orientation', 'landscape');


	// create fragment with auto creation of view
	layout.setFragSpec({
		name: 'view2',
		props: {
			backgroundColor: 'red'
		}
	});
	layout.setFragSpec({
		name: 'view2',
		pos: [4,0],
		span: [1,2]
	}, layout.DynamicLayer, 'orientation', 'portrait');
	layout.setFragSpec({
		name: 'view2',
		pos: [4,7],
		span: [1,2]
	}, layout.DynamicLayer, 'orientation', 'landscape');


	// data driven fragment specification for 3 dynamic fragments
	var specs = [
		{spec:{name: 'view3', pos: [2,0], span: [1,1], props: {backgroundColor: 'green'}},
			layer:'DynamicLayer', aspect:'orientation', aspectValue:'portrait'},
		{spec:{name: 'view3', pos: [5,6], span: [1,1], props: {backgroundColor: 'green'}},
			layer:'DynamicLayer', aspect:'orientation', aspectValue:'landscape'},
		{spec:{name: 'view4', pos: [1,0], span: [1,1], props: {backgroundColor: 'silver'}},
			layer:'DynamicLayer', aspect:'orientation', aspectValue:'portrait'},
		{spec:{name: 'view4', pos: [6,5], span: [1,1], props: {backgroundColor: 'silver'}},
			layer:'DynamicLayer', aspect:'orientation', aspectValue:'landscape'},
		{spec:{name: 'view5', pos: [0,3], span: [5,8]},
			layer:'DynamicLayer', aspect:'orientation', aspectValue:'portrait'},
		{spec:{name: 'view5', pos: [0,0], span: [8,4]},
			layer:'DynamicLayer', aspect:'orientation', aspectValue:'landscape'}
	];
	for (var i=0, l=specs.length; i<l; i++) {
		var s = specs[i];
		layout.setFragSpec(s.spec, layout[s.layer], s.aspect, s.aspectValue);
	}


	layout.compose();	// fragments that don't already exist are created in compose()


	// accessing view from last created fragment to add web view
	var web = Ti.UI.createWebView({
		url: 'http://olivalabs.com',
		borderWidth: 1,
		borderColor: '#ddd',
		scalesPageToFit: true
	});
	layout.getFragment('view5').getView().add(web);

	// accessing earlier view to add some buttons
	var v1 = layout.getFragment('view1').getView();
	v1.add(Ti.UI.createButton({
		top: '13%',
		width: '50%',
		height: '30%',
		title: 'Button 1'
	}));
	v1.add(Ti.UI.createButton({
		top: '13%',
		width: '50%',
		height: '30%',
		title: 'Button 2'
	}));

	//create fragment only visible in portrait mode
	layout.setFragSpec({
		name: 'view6',
		pos: [0,0],
		span: [1,1]
	});
	layout.setFragSpec({
		name: 'view6',
		props: {visible: true, backgroundColor: 'black'}
	}, layout.DynamicLayer, 'orientation', 'portrait');
	layout.setFragSpec({
		name: 'view6',
		props: {visible: false}
	}, layout.DynamicLayer, 'orientation', 'landscape');


	layout.compose();
});

$.index.open();

