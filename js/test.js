// Create a centered text item at the center of the view:
var path = new Path();
path.strokeColor = 'white';
path.add(new Point(0, 60));
path.add(new Point(8, 30));
path.add(new Point(16, 60));
path.closed = true;


var destination = view.center;

var vector = destination - path.position;

var c = new Path.Circle(destination, 2);
c.style = {
	fillColor: 'white',
	strokeColor: 'white'
};

//path.position += vector / 30;
path.rotate(vector.angle);