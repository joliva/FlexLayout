function TiGridCoordinate(_args) {
    this.bottom = _args.bottom;
    this.top = _args.bottom + _args.height;
    this.left = _args.left;
    this.right = _args.left + _args.width;
    this.height = _args.height;
    this.width = _args.width;
}

function TiGrid(_args) {
    _args = _args || {};
    this.cols = _args.cols || 1;
    this.rows = _args.rows || 1;
    this.width = _args.width || 0;
    this.height = _args.height || 0;
    this.margin = _args.margin || 0;
    if (1 > this.cols || 1 > this.rows || 1 > this.width || 1 > this.height) throw new Error("Incorrect parameters: cols, rows, width and height should be defined and greater than zero");
}

TiGridCoordinate.prototype.position = function(view) {
    view.bottom = this.bottom;
    view.left = this.left;
    view.height = this.height;
    view.width = this.width;
};

TiGrid.prototype.coord = function(x, y, _args) {
    _args = _args || {};
    var colspan = _args.colspan || 1, rowspan = _args.rowspan || 1;
    if (0 > x || x > this.cols || 0 > y || y > this.rows) throw new Error("Incorrect parameters: x or y out of bounds");
    if (1 > rowspan || rowspan > this.rows || 1 > colspan || colspan > this.cols) throw new Error("Incorrect parameters: colspan or rowspan out of bounds");
    return new TiGridCoordinate({
        bottom: y * (this.height / this.rows) + this.margin,
        left: x * (this.width / this.cols) + this.margin,
        height: rowspan * Math.ceil(this.height / this.rows) - 2 * this.margin,
        width: colspan * Math.ceil(this.width / this.cols) - 2 * this.margin
    });
};

module.exports = TiGrid;