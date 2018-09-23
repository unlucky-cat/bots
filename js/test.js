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


var getCentroid = function(path) {
    var x = path.segments.reduce(function(acc, curr) { return acc + curr.point.x; }, 0);
    var y = path.segments.reduce(function(acc, curr) { return acc + curr.point.y; }, 0);

    return new Point(x/3, y/3);
}

var getShift = function(path) {
    return path.position - getCentroid(path);
}

var jumpTo = function(path, point) {

    path.position += point - getCentroid(path);
}

var jumpTowards = function(path, vector) {

    path.position += vector;
}

//////////////////////////////////////////////////////
// Create a centered text item at the center of the view:

var boid = new Path();
boid.strokeColor = 'white';
boid.add(new Point(0, 60));
boid.add(new Point(8, 30));
boid.add(new Point(16, 60));
boid.scaling *= 2;
boid.closed = true;
boid.fullySelected = true;

boid.rotate(90, getCentroid(boid));

var center = drawCircle(view.center, 3, 'orange');

var destination = getDecision("").dest;
var dest = drawCircle(destination, 2, 'white');
var vector = destination - getCentroid(boid);
boid.rotate(vector.angle, getCentroid(boid));
vector.length = 5;
//jumpTo(boid, destination);


//boid.rotate(vector.angle);
//var prevAngle = -vector.angle;
/*
drawCircle(boid.position, 2, 'green');
drawCircle(getCentroid(boid), 2, 'red');
console.log(getCentroid(boid));
var boidPosition = drawCircle(boid.position, 2, 'yellow');
*/

var centroid = drawCircle(getCentroid(boid), 2, 'red');

document.querySelector('#btn-1').addEventListener('click', function(e) {

	boid.rotate(45, getCentroid(boid));
	//boidPosition.position = boid.position;
});


document.querySelector('#btn-2').addEventListener('click', function(e) {

    //boid.position -= new Point(10, 0);
    //jumpTo(boid, destination);

    jumpTowards(boid, vector);
});
