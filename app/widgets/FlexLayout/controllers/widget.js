var args = arguments[0] || {};

var TiGrid = require(WPATH('TiGrid'));

/* Layout (JSON format)
 * 
 * name: convenient way to refer to layout
 * 
 * The following FragDictionaries are keyed by the fragment name:
 * defaultFragSpecs: default fragment FragDictionary
 * staticFragSpecs: changes after defaultFragSpecs based on static aspects
 * dynamicFragSpecs: changes after staticFragSpecs based on dynamic aspects
 * currentFragSpecs: saved fragment FragDictionary after dynamicFragSpecs has been applied
 * 
 * fragments: layout fragment dictionary keyed by fragment name
 */

/* Fragment specification (JSON format)
 * 
 * All elements are optional.
 * 
 * name: convenient way to refer to fragment
 * pos: position of fragment [x,y] in upper-right quadrant
 * span: extent of fragment [rows, cols]
 * view: view to render in fragment (if not provided automatically created)
 * props: properties to apply to view in JSON format
 */

// Make a new grid with the dimensions we want
var grid = new TiGrid({
    height: args.height || Ti.Platform.displayCaps.platformHeight,
    width: args.width || Ti.Platform.displayCaps.platformWidth,
    cols: args.cols || 3,
    rows: args.rows || 3,
    margin: args.margin || 0
});

$.getDimension = function() {
	return [this.rows, this.cols];
}

$.createFragment = function(fragSpec) {
	fragSpec = fragSpec || {};

	var frag = new Fragment(fragSpec);
	
	$.widget.add(frag.view);
	return frag;
}

$.createLayout = function(name) {
	if (!name) name = 'main';
	
	return new Layout(name);
}

function Fragment(fragSpec) {
	_.extend(this, fragSpec);
	this.view = this.view || Ti.UI.createView();
	
	if (this.props) {
		this.view.applyProperties(this.props);
	}
}

Fragment.prototype.getView = function() {
	return this.view;
};

Fragment.prototype.place = function(pos, span) {
	this.pos = pos || [0,0];	// [x,y]
	this.span = span || [1,1];	// [rows,cols]
	
	return this;	// returns fragment
}

Fragment.prototype.draw = function() {
	if (this.pos && this.span) {
		grid.coord(this.pos[0], this.pos[1],{rowspan: this.span[0], colspan: this.span[1]}).position(this.view);
	}
	
	return this;	// returns fragment
}

function Layout(name) {
	this.name = name;
	
	this.defaultFragSpecs = {};
	this.currentFragSpecs = {};
	
	this.staticFragSpecs = {};
	this.staticFragSpecs.formFactor = {};
	this.staticFragSpecs.formFactor.handheld = {};
	this.staticFragSpecs.formFactor.tablet = {};
	
	this.dynamicFragSpecs = {};
	this.dynamicFragSpecs.orientation = {};
	this.dynamicFragSpecs.orientation.portrait = {};	
	this.dynamicFragSpecs.orientation.landscape = {};
	
	this.fragments = {};
}

//some Layout constants
Layout.prototype.DefaultLayer = 1;		// default fragment specs
Layout.prototype.StaticLayer = 2;		// static fragment specs
Layout.prototype.DynamicLayer = 3;		// dynamic fragment specs

Layout.prototype.addFragSpec = function(fragSpec, layer) {
	if (!fragSpec) throw 'addFragSpec: invalid value for fragSpec';
	
	var layer = layer || Layout.prototype.DefaultLayer;
	
	switch (layer) {
	case Layout.prototype.DefaultLayer:
		this.defaultFragSpecs[fragSpec.name] = fragSpec;
		break;
	case Layout.prototype.DynamicLayer:
		this.staticFragSpecs[fragSpec.name] = fragSpec;
		break;
	case Layout.prototype.StaticLayer:
		this.dynamicFragSpecs[fragSpec.name] = fragSpec;
		break;
	default:
		throw 'addFragSpec: invalid value for layer';
		break;
	}
}

// NOTE: this renders directly from the default layer for now
Layout.prototype.compose = function() {
	// work through default, static, and dynamic layers to determine the minimal set of changes
	// necessary to apply to the Titanium proxies to draw the layout
	
	// for now simply copy defaults over to current
	this.currentFragSpecs = this.defaultFragSpecs;

	for (var name in this.defaultFragSpecs) {
		var frag = this.fragments[name] = $.createFragment(this.defaultFragSpecs[name]);
		frag.draw();
	}
}

Layout.prototype.getFragment = function(name) {
	if (this.fragments.hasOwnProperty(name)) {
		return this.fragments[name];
	} else {
		throw 'getFragment: invalid value for name';
	}
}
