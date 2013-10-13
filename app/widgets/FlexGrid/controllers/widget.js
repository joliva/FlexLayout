var args = arguments[0] || {};

var TiGrid = require(WPATH('TiGrid'));

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

// some FlexGrid widget constants
$.widget.format = {}
$.widget.format.ALL = 0;			// all formats
$.widget.format.HAND_PORT = 1;		// hand-held, portrait
$.widget.format.HAND_LAND = 2;		// hand-held, landscape
$.widget.format.TABLET_PORT = 3;	// tablet, portrait
$.widget.format.TABLET_LAND = 4;	// tablet, landscape

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

function Fragment(fragSpec) {
	_.extend(this, fragSpec);
	this.view = this.view || Ti.UI.createView();
	
	if (this.props) {
		this.view.applyProperties(this.props);
	}
	
	if (this.pos && this.span) {
		this.draw();
	}
}

Fragment.prototype.getView = function() {
	return this.view;
};

Fragment.prototype.place = function(pos, span) {
	this.pos = pos || [0,0];	// [x,y]
	this.span = span || [1,1];	// [rows,cols]
	this.draw();
	
	return this;	// returns fragment
}

Fragment.prototype.draw = function() {
	grid.coord(this.pos[0], this.pos[1],{rowspan: this.span[0], colspan: this.span[1]}).position(this.view);
	
	return this;	// returns fragment
}

$.createLayout = function(fragments /*array*/) {
	var v = view || Ti.UI.createView();
	
	var frag = new Fragment({'view':v});
	
	$.widget.add(frag.view);
	return frag;
}