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
 * dirty: flag indicating if spec has changed since flag last cleared
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

Fragment.prototype.update = function(fragSpec) {
	fragSpec = fragSpec || {};

	_.extend(this, fragSpec);
	if (this.props) {
		this.view.applyProperties(this.props);
	}

	return this;	// returns fragment
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
	this.staticFragSpecs.formFactor.selector = (Alloy.isHandheld) ? 'handheld' : 'tablet';
	
	this.dynamicFragSpecs = {};
	this.dynamicFragSpecs.orientation = {};
	this.dynamicFragSpecs.orientation.portrait = {};	
	this.dynamicFragSpecs.orientation.landscape = {};
	this.dynamicFragSpecs.orientation.selector = (Ti.Gesture.isPortrait()) ? 'portrait' : 'landscape';
	
	this.fragments = {};
}

//some Layout constants
Layout.prototype.DefaultLayer = 'defaultFragSpecs';		// default fragment specs
Layout.prototype.StaticLayer = 'staticFragSpecs';		// static fragment specs
Layout.prototype.DynamicLayer = 'dynamicFragSpecs';		// dynamic fragment specs

Layout.prototype.validAspect = function(aspect, aspectValue, layer) {
	if (layer !== Layout.prototype.DefaultLayer) {
		if (this[layer].hasOwnProperty(aspect)) {
			return this[layer][aspect].hasOwnProperty(aspectValue) ? true : false;
		} else {
			return false;
		}
		return	this[layer].hasOwnProperty(aspect) ? true : false;
	} else {
		throw 'validAspect: DefaultLayer does not have aspects';
	}
	
}

Layout.prototype.setFragSpec = function(fragSpec, layer, aspect, aspectValue) {
	if (!fragSpec) throw 'setFragSpec: invalid value for fragSpec';
		
	var layer = layer || Layout.prototype.DefaultLayer;
	
	fragSpec.dirty = true;
	
	switch (layer) {
	case Layout.prototype.DefaultLayer:
		this.defaultFragSpecs[fragSpec.name] = fragSpec;
		break;
	case Layout.prototype.StaticLayer:
		var aspect = aspect || 'formFactor';	// default static layer aspect
		
		if (!aspectValue) throw 'setFragSpec: invalid value for aspectValue: ' + layer + '/' + aspect + '/' + aspectValue;
		
		if (this.validAspect(aspect, aspectValue, layer)) {
			this.staticFragSpecs[aspect][aspectValue][fragSpec.name] = fragSpec;
		} else {
			throw 'setFragSpec: invalid aspect for layer: ' + layer + '/' + aspect;
		}
		break;
	case Layout.prototype.DynamicLayer:
		var aspect = aspect || 'orientation';	// default dynamic layer aspect
		
		if (!aspectValue) throw 'setFragSpec: invalid value for aspectValue: ' + layer + '/' + aspect + '/' + aspectValue;
		
		if (this.validAspect(aspect, aspectValue, layer)) {
			this.dynamicFragSpecs[aspect][aspectValue][fragSpec.name] = fragSpec;
		} else {
			throw 'setFragSpec: invalid aspect for layer: ' + layer + '/' + aspect;
		}
		break;
	default:
		throw 'addFragSpec: invalid value for layer';
		break;
	}
}

Layout.prototype.getFragSpec = function(name, layer, aspect) {	
	var layer = layer || Layout.prototype.DefaultLayer;
	
	if (validLayer(layer)) {
		if (this[layer].hasOwnProperty(name)) {
			return this[layer][name];
		} else {
			throw 'getFragSpec: invalid fragment spec name: ' + name;
		}
	} else {
		throw 'getFragSpec: invalid value for layer';
	}
}

// NOTE: this renders directly from the default layer for now
Layout.prototype.compose = function() {
	// work through default, static, and dynamic layers to determine the minimal set of changes
	// necessary to apply to the Titanium proxies to draw the layout
	
	for (var name in this.defaultFragSpecs) {
		var fragSpec = this.defaultFragSpecs[name];
		
		// go through each aspect of the static fragment spec aspects to determine which
		// have changed and should be applied during the update
		for (var aspect in this.staticFragSpecs) {
			for (var aspectVal in this.staticFragSpecs[aspect]) {
				if (this.staticFragSpecs[aspect].dirty === true) {
					Ti.API.debug('aspect: ' + aspect);
					Ti.API.debug('aspectVal: ' + aspectVal);
				}
			}
		}
		
		if (fragSpec.dirty == true) {
			var frag;
			
			// create fragment if first time, otherwise update
			if (this.fragments.hasOwnProperty(name) === false) {
				// create
				frag = this.fragments[name] = $.createFragment(fragSpec);
			} else {
				// update
				frag = this.fragments[name];
				frag.update(fragSpec);
			}
			fragSpec.dirty = false;		// clear dirty flag
			frag.draw();
		}
	}
	
	// for now simply copy defaults over to current
	this.currentFragSpecs = this.defaultFragSpecs;
}

Layout.prototype.getFragment = function(name) {
	if (this.fragments.hasOwnProperty(name)) {
		return this.fragments[name];
	} else {
		throw 'getFragment: invalid value for name';
	}
}
