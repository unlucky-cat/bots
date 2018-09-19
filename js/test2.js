// Create a centered text item at the center of the view:
var boid = new Path();
boid.strokeColor = 'white';
boid.add(new Point(0, 60));
boid.add(new Point(8, 30));
boid.add(new Point(16, 60));
boid.closed = true;

boid.scaling *= 4;
boid.fullySelected = true;
boid.position = view.center;


var c = new Path.Circle(boid.position, 2);
c.strokeColor = 'white'

function onFrame(event) {

	boid.rotate(0.3);
    var v = new Path.Circle(boid.position, 2);
    v.strokeColor = 'lime';
}