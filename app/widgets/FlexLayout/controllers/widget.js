var args = arguments[0] || {};

var TiGrid = require(WPATH('TiGrid'));
var Logger = require(WPATH('common/TimeLogger'));	// logging support
var logger = new Logger('FlexLayout');

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
	var self = this;
	
	self.name = name;
	
	self.defaultFragSpecs = {};
	self.currentFragSpecs = {};
	
	self.staticFragSpecs = {};
	self.staticFragSpecs.formFactor = {};
	self.staticFragSpecs.formFactor.handheld = {};
	self.staticFragSpecs.formFactor.tablet = {};
	self.staticFragSpecs.formFactor.selector = (Alloy.isHandheld) ? 'handheld' : 'tablet';
	
	self.dynamicFragSpecs = {};
	self.dynamicFragSpecs.orientation = {};
	self.dynamicFragSpecs.orientation.portrait = {};	
	self.dynamicFragSpecs.orientation.landscape = {};
	self.dynamicFragSpecs.orientation.selector = (Ti.Gesture.isPortrait()) ? 'portrait' : 'landscape';
	
	self.fragments = {};
	
	// dynamic updating
	Ti.Gesture.addEventListener('orientationchange', function(e) {
		var selector = (Ti.Gesture.isPortrait()) ? 'portrait' : 'landscape';
		self.dynamicFragSpecs.orientation.selector = selector;
		Ti.API.debug(selector);
		
		// reconfigure TiGrid so that grid is computed based on the new orientation
		
		Ti.API.debug('reconfiguring grid...');
		grid.reconfigure({
			height: args.height || Ti.Platform.displayCaps.platformHeight,
			width: args.width || Ti.Platform.displayCaps.platformWidth
		});
		
		Ti.API.debug('grid: ' + JSON.stringify(grid));
			
		
		// cycle over the dynamic fragment specs for the new orientation and set dirty
		// so they are redrawn based on the new specs
		for (var key in self.dynamicFragSpecs.orientation[selector]) {
			Ti.API.debug('setting dirty: ' + key);
			self.dynamicFragSpecs.orientation[selector][key].dirty = true;
		}
		
		// cycle through fragments and redraw them using the new grid
		Ti.API.debug('redraw fragments based on new grid...');
		for (key in self.fragments) {
			self.fragments[key].draw();
		}

		self.compose();
	});
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
		this.currentFragSpecs[fragSpec.name] = {};
		break;
	case Layout.prototype.StaticLayer:
		var aspect = aspect || 'formFactor';	// default static layer aspect
		
		if (!aspectValue) throw 'setFragSpec: invalid value for aspectValue: ' + layer + '/' + aspect + '/' + aspectValue;
		
		if (this.validAspect(aspect, aspectValue, layer)) {
			this.staticFragSpecs[aspect][aspectValue][fragSpec.name] = fragSpec;
			this.currentFragSpecs[fragSpec.name] = {};
		} else {
			throw 'setFragSpec: invalid aspect for layer: ' + layer + '/' + aspect;
		}
		break;
	case Layout.prototype.DynamicLayer:
		var aspect = aspect || 'orientation';	// default dynamic layer aspect
		
		if (!aspectValue) throw 'setFragSpec: invalid value for aspectValue: ' + layer + '/' + aspect + '/' + aspectValue;
		
		if (this.validAspect(aspect, aspectValue, layer)) {
			this.dynamicFragSpecs[aspect][aspectValue][fragSpec.name] = fragSpec;
			this.currentFragSpecs[fragSpec.name] = {};
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

Layout.prototype.compose = function() {
	Ti.API.debug('composing...');
	
	// work through default, static, and dynamic layers to determine the minimal set of changes
	// necessary to apply to the Titanium proxies to draw the layout
	
	// Cycle over all layers to create a list of all fragment spec names.
	// It is necessary to do this to allow fragment specs in the static and dynamic layers 
	// that do not exist in the default layer.

	var fragSpecNames = {};
	for (var name in this.defaultFragSpecs) fragSpecNames[name] = 1;
	for (var name in this.staticFragSpecs.formFactor.handheld) fragSpecNames[name] = 1;
	for (var name in this.staticFragSpecs.formFactor.tablet) fragSpecNames[name] = 1;
	for (var name in this.dynamicFragSpecs.orientation.portrait) fragSpecNames[name] = 1;
	for (var name in this.dynamicFragSpecs.orientation.landscape) fragSpecNames[name] = 1;
	
	for (var name in fragSpecNames) {
		var fragSpec = {};
		var dirty = false;

		if (this.defaultFragSpecs.hasOwnProperty(name)) {
			if (this.defaultFragSpecs[name].dirty === true) {
				dirty = true
				_.extend(fragSpec, this.defaultFragSpecs[name]);
				this.defaultFragSpecs[name].dirty = false;
			}
		}
		
		// go through each aspect of the static fragment spec aspects to determine which
		// have changed and should be applied during the update
		for (var aspect in this.staticFragSpecs) {
			var selector = this.staticFragSpecs[aspect].selector;
			
			if (this.staticFragSpecs[aspect][selector].hasOwnProperty(name)) {
				if (this.staticFragSpecs[aspect][selector][name].dirty === true) {
					dirty = true;
					_.extend(fragSpec, this.staticFragSpecs[aspect][selector][name]);
					this.staticFragSpecs[aspect][selector][name].dirty = false;
				}				
			}
		}
		
		// go through each aspect of the dynamic fragment spec aspects to determine which
		// have changed and should be applied during the update
		for (var aspect in this.dynamicFragSpecs) {
			var selector = this.dynamicFragSpecs[aspect].selector;
			
			if (this.dynamicFragSpecs[aspect][selector].hasOwnProperty(name)) {
				if (this.dynamicFragSpecs[aspect][selector][name].dirty === true) {
					dirty = true;
					_.extend(fragSpec, this.dynamicFragSpecs[aspect][selector][name]);
					this.dynamicFragSpecs[aspect][selector][name].dirty = false;
				}				
			}
		}
		
		if (dirty == true) {
			Ti.API.debug(fragSpec);
			
			var frag;
			
			fragSpec.dirty = false;
			
			// create fragment if first time, otherwise update
			if (this.fragments.hasOwnProperty(name) === false) {
				// create
				frag = this.fragments[name] = $.createFragment(fragSpec);
			} else {
				// update
				frag = this.fragments[name];
				frag.update(fragSpec);
			}
			frag.draw();
			
			// update current fragment spec from new one
			_.extend(this.currentFragSpecs[name], fragSpec);
		}
	}
}

Layout.prototype.getFragment = function(name) {
	if (this.fragments.hasOwnProperty(name)) {
		return this.fragments[name];
	} else {
		logger.error('getFragment: invalid value for name');
	}
}

