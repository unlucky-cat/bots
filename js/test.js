
var drawVectorFromPoint2 = function(point, vector, color) {

    new Path.Line(point, vector).strokeColor = color;
    new Path.Circle(vector, 2).strokeColor = color;
}

var getRandomPoint = function() {
    return Point.random() * view.size / 2;
}

var getRandomAngle = function() {
    return -180 + Math.random() * 180;
}

var getAttractionForces2 = function(init_force, boid, flock, distanceToScan) {

    var centroid = boid.get_centroid();
    var name = boid.name;
    var movementDirection = boid.movementVector;
    console.log('main-' + boid.name + ': ' + movementDirection.angle);

    return flock
    .filter(function (flock_boid) {
        return name !== flock_boid.name;
    })
    .map(function (flock_boid) {
        return [flock_boid.get_centroid(), flock_boid.name];
    })
    .filter(function(arr) {
        var flock_centroid = arr[0];
        console.log('flock_centroid: ' + flock_centroid);
        var flock_name = arr[1];
        var distanceVector = centroid - flock_centroid;
        var flockMemberDirection = flock_centroid - centroid;
        var angleBetween = Math.abs(movementDirection.angle - flockMemberDirection.angle);
        if (angleBetween > 360) angleBetween = 360 - angleBetween;

        console.log('flock-' + flock_name + ': ' + flockMemberDirection.angle);
        console.log('angle between ' + flock_name + ' and ' + name + ' is ' + angleBetween);

        return distanceVector.length > 0 && distanceVector.length <= distanceToScan && angleBetween <= 100;
    })
    .reduce(function (accumulativeVector, arr) {
        
        var flock_centroid = arr[0];
        var distanceVector = centroid - flock_centroid;
        distanceVector.length = distanceToScan - distanceVector.length;

        drawVectorFromPoint2(flock_centroid, centroid, 'yellow');      

        return accumulativeVector + distanceVector;
    }, init_force);
}


var b1 = new Boid('white', 'white', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map);
var b2 = new Boid('red', 'red', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map);
var b3 = new Boid('lime', 'lime', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map);

var radius = 200;
var f = [b1, b2, b3];
var start_force = new Point(0, 0);
var v1 = getAttractionForces2(start_force, b1, f, radius);

//new Path.Circle(b1.get_centroid(), radius).strokeColor = 'yellow';

drawVectorFromPoint2(b1.get_centroid(), b1.get_centroid() + v1, 'white');


/*
document.querySelector('#btn-1').addEventListener('click', function(e) {
    
});


document.querySelector('#btn-2').addEventListener('click', function(e) {

    //boid.position -= new Point(10, 0);
    //jumpTo(boid, destination);

    //jumpTowards(boid, vector);
});
*/