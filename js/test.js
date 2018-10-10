
var drawVectorFromPoint = function(point, vector, color) {

    new Path.Line(point, vector).strokeColor = color;
    new Path.Circle(vector, 2).strokeColor = color;
}

var getRandomPoint = function() {
    return Point.random() * view.size;
}

var getRandomAngle = function() {
    return -180 + Math.random() * 180;
}

var getAttractionForces = function(init_force, boid, flock, distanceToScan) {

    var centroid = boid.get_centroid();
    var name = boid.name;

    return flock
    .filter(function (flock_boid) {
        return name !== flock_boid.name;
    })
    .map(function (flock_boid) {
        return flock_boid.get_centroid();
    })
    .filter(function(flock_centroid) {
        var distanceVector = centroid - flock_centroid;

        return distanceVector.length > 0 && distanceVector.length <= distanceToScan;
    })
    .reduce(function (accumulativeVector, flock_centroid) {
        
        var distanceVector = centroid - flock_centroid;
        distanceVector.length = distanceToScan - distanceVector.length;

        drawVectorFromPoint(flock_centroid, centroid, 'yellow');      

        return accumulativeVector + distanceVector;
    }, init_force);
}


var b1 = new Boid('white', 'boid1', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map);
var b2 = new Boid('red', 'boid2', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map);
var b3 = new Boid('lime', 'boid3', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map);

var radius = 100;
var f = [b2, b3];
var start_force = new Point(0, 0);
var v1 = getAttractionForces(start_force, b1, f, radius);

//new Path.Circle(b1.get_centroid(), radius).strokeColor = 'yellow';

drawVectorFromPoint(b1.get_centroid(), b1.get_centroid() + v1, 'white');

/*
document.querySelector('#btn-1').addEventListener('click', function(e) {
    
});


document.querySelector('#btn-2').addEventListener('click', function(e) {

    //boid.position -= new Point(10, 0);
    //jumpTo(boid, destination);

    //jumpTowards(boid, vector);
});
*/