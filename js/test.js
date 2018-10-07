
var drawVectorFromPoint = function(point, vector, color) {

    new Path.Line(point, vector).strokeColor = color;
    new Path.Circle(vector, 2).strokeColor = color;
}

var zero = new Point([0, 0]);

var v1 = new Point(20, 30);
console.log(v1.x + ' / ' + v1.y + ' / '+v1.angle + ' / '+v1.length);
drawVectorFromPoint(zero, v1, 'white');

var v2 = new Point(30, 20);
console.log(v2.x + ' / ' + v2.y + ' / '+v2.angle + ' / '+v2.length);
drawVectorFromPoint(zero, v2, 'lime');

var v3 = v2 - v1;
console.log(v3.x + ' / ' + v3.y + ' / '+v3.angle + ' / '+v3.length);
drawVectorFromPoint(v1, v2, 'yellow');

////////////////////////////////////////////////////////////

document.querySelector('#btn-1').addEventListener('click', function(e) {

	//boid.rotate(45, getCentroid(boid));
	//boidPosition.position = boid.position;
});


document.querySelector('#btn-2').addEventListener('click', function(e) {

    //boid.position -= new Point(10, 0);
    //jumpTo(boid, destination);

    //jumpTowards(boid, vector);
});
