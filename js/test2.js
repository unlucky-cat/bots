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

var v = new Path.Circle(boid.position, 2);
v.strokeColor = 'lime';
var vs = new Symbol(v);
var rectCenter = vs.place(boid.position);

function onFrame(event) {

    boid.rotate(0.7);

    rect.remove();
    rect = rs.place(boid.position);
    rect.bounds = boid.bounds;
    
    // drawing rectangle's center
    rectCenter.remove();
    rectCenter = vs.place(boid.position);
}