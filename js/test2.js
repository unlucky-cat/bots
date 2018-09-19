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

function onFrame(event) {

    boid.rotate(0.7);

    r.remove();
    r = new Path.Rectangle(boid.bounds);
    r.strokeColor = 'yellow';
    
    // drawing rectangle's center
    var v = new Path.Circle(boid.position, 2);
    v.strokeColor = 'lime';

    // drawing point
    var c = new Path.Circle(view.center, 2);
    c.strokeColor = 'red';

    //r.remove();
}