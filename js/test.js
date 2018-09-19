// Create a centered text item at the center of the view:
var boid = new Path();
boid.strokeColor = 'white';
boid.add(new Point(0, 60));
boid.add(new Point(8, 30));
boid.add(new Point(16, 60));
boid.scaling *= 2;
boid.closed = true;
boid.position = view.center;

// aligning boid along X axys (0 degrees)
boid.rotate(90);


var getDecision = function(context)
{
    return dm.map(context, function(dest)
    {
        return {
            dest: new Point(dest.x, dest.y) * view.size,
            interval: dest.interval,
            degree: dest.degree,
        }
    });
};

var drawCircle = function(center, radius, color) {
	
	var dest = new Path.Circle(center, radius);
	dest.fillColor = color;

	return dest;
}
//////////////////////////////////////////////////////

var destination = getDecision("").dest;
var vector = destination - boid.position;

drawCircle(destination, 2, 'white');
drawCircle(boid.position, 2, 'green');
var boidPosition = drawCircle(boid.position, 2, 'yellow');

var prevAngle = -vector.angle;
boid.fullySelected = true;

document.querySelector('#btn-1').addEventListener('click', function(e) {
	boid.rotate(45);
	boidPosition.position = boid.position;
});