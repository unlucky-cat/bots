// Creating a triangle object
var boid = new Path();
boid.strokeColor = 'white';
boid.add(new Point(0, 60));
boid.add(new Point(8, 30));
boid.add(new Point(16, 60));
boid.closed = true;

boid.scaling *= 4;
boid.fullySelected = true;

boid.position = view.center;

//TODO add Symbols!!!!

var r = new Path.Rectangle(boid.bounds);
r.strokeColor = 'yellow';
var rs = new Symbol(r);
var rect = rs.place(boid.position);

var t = new Path.Circle(view.center, 2);
t.strokeColor = 'white';
var ts = new Symbol(t);
var screenCenter = ts.place(view.center);

var v = new Path.Circle(boid.position, 2);
v.strokeColor = 'lime';
var vs = new Symbol(v);
var rectCenter = vs.place(boid.position);

var getCentroidx = function(path) {
    var x = path.segments.reduce(function(acc, curr) { return acc + curr.point.x; }, 0);
    var y = path.segments.reduce(function(acc, curr) { return acc + curr.point.y; }, 0);

    return new Point(x/3, y/3);
}

var g = new Path.Circle(boid.position, 2);
g.strokeColor = 'red';
var gs = new Symbol(g);
var rectRealCenter = gs.place(getCentroidx(boid));

function onFrame(event) {

    boid.rotate(0.7);

    rect.remove();
    rect = rs.place(boid.position);
    rect.bounds = boid.bounds;

    screenCenter.remove();
    screenCenter = ts.place(view.center);
    
    // drawing rectangle's center
    rectCenter.remove();
    rectCenter = vs.place(boid.position);

    rectRealCenter.remove();
    rectRealCenter = gs.place(getCentroidx(boid));
}