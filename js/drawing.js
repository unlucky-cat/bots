////////////////////// Path Extensions //////////////////////

Path.Triangle = function Triangle(p1, p2, p3) {
    Path.call(this, [p1, p2, p3]);
    this.closed = true;

    this.get_centroid = function() {
        var x = this.segments.reduce(function(acc, curr) { return acc + curr.point.x; }, 0);
        var y = this.segments.reduce(function(acc, curr) { return acc + curr.point.y; }, 0);
    
        return new Point(x/3, y/3);
    }

    this.get_vector_to = function(point) {
        return point - this.get_centroid();
    }

    this.move_to = function(point) {
        this.position += this.get_vector_to(point);
    }

    this.rotate_centroid = function(a) {
        this.rotate(a, this.get_centroid());
    }
}

Path.Triangle.prototype = Object.create(Path.prototype);
Path.Triangle.prototype.constructor = Path.Triangle;

////////////////////////////////////////////////////////////

var boid = new Path.Triangle(
    new Point(0, 60),
    new Point(8, 30),
    new Point(16, 60)
)
boid.strokeColor = 'white';
boid.scaling *= 1;
boid.move_to(view.center);

// aligning boid along X axys (0 degrees)
boid.rotate_centroid(90);

// dependency injection point
// wrapper-function for decision making (DM)
// it hides DM implementation details from the code below
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
};

var sc = drawCircle(view.center, 2, 'red');

var createJumper = function(speed) {

    var destination = getDecision("").dest;
    var vector = destination - boid.position;

    // saving current angle in order to return it back to 0 degree by rotating boid back later
    var prevMovementVectorAngle = -vector.angle;
    boid.rotate(vector.angle);

    return {
        execute: function (event) {

            //boid.position += vector / 30;
            vector.length = speed; 
            boid.position += vector;
            vector = destination - boid.position;    
            
            if (vector.length < 1) {
                destination = getDecision("").dest;
                vector = destination - boid.position;
                boid.rotate(prevMovementVectorAngle);
                boid.rotate(vector.angle);
                prevMovementVectorAngle = -vector.angle;
            }
        }
    }
}


var createWanderer = function(speed) {

    var decision = getDecision("");
    var directionChangingTime = Date.now() + decision.interval;

    // movementVector represents movement direction (angle) and speed (length)
    var movementVector = boid.get_vector_to(decision.dest);
    movementVector.length = speed;
    boid.rotate_centroid(movementVector.angle);


    // saving current angle in order to return it back to 0 degree by rotating boid back later
    var prevMovementVectorAngle = movementVector.angle;
    

    return {
        execute: function onFrame(event) {
            
            // is it time to change direction?
            if (Date.now() >= directionChangingTime) {
                movementVector.angle += decision.degree;
                decision = getDecision("");
                directionChangingTime = Date.now() + decision.interval;

                // rotating boid "back" to 0 degrees
                boid.rotate_centroid(-prevMovementVectorAngle);
                boid.rotate_centroid(movementVector.angle);
                prevMovementVectorAngle = movementVector.angle;
            }

            var nextPos = boid.get_centroid() + movementVector;


            // jumping t0 the "other side" of the screen
            var jumpPos;

            if (nextPos.x <= 0) jumpPos = new Point(view.size.width, nextPos.y);
            else if (nextPos.x >= view.size.width) jumpPos = new Point(0, nextPos.y);
            else if (nextPos.y <= 0) jumpPos = new Point(nextPos.x, view.size.height);
            else if (nextPos.y >= view.size.height) jumpPos = new Point(nextPos.x, 0);
            else jumpPos = nextPos;

            boid.move_to(jumpPos);
        }
    }
}

//var action = createJumper(1);
var action = createWanderer(1);

function onFrame(event) {

    action.execute(event);
}
