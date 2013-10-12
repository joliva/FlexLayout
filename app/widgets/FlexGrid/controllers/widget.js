var args = arguments[0] || {};

var TiGrid = require(WPATH('TiGrid'));

// Make a new grid with the dimensions we want
var grid = new TiGrid({
    height: args.height || Ti.Platform.displayCaps.platformHeight,
    width: args.width || Ti.Platform.displayCaps.platformWidth,
    cols: args.cols || 3,
    rows: args.rows || 3,
    margin: args.margin || 0
});

$.addView = function(view, coord, span) {
	coord = coord || [0,0];	// [x,y]
	span = span || [1,1];	// [rows,cols]
	
	$.widget.add(view);
	grid.coord(coord[0], coord[1],{rowspan: span[0], colspan: span[1]}).position(view);
}

$.getRows = function() {
	return this.rows;
}

$.getCols = function() {
	return this.cols;
}