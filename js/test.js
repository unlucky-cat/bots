// Create a centered text item at the center of the view:
var triangle = new Path();
triangle.strokeColor = 'white';
triangle.add(new Point(0, 60));
triangle.add(new Point(8, 30));
triangle.add(new Point(16, 60));
triangle.closed = true;

triangle.rotate(90);


var destination = view.center;

var vector = destination - triangle.position;

var c = new Path.Circle(destination, 2);
c.style = {
	fillColor: 'white',
	strokeColor: 'white'
};

//triangle.position += vector / 30;
triangle.rotate(-0);
triangle.rotate(vector.angle);
