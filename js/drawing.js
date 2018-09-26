////////////////////// Triangle //////////////////////

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

    this.rotate_centroid = function(angle) {
        this.rotate(angle, this.get_centroid());
    }
/*
    this.rotate_towards = function(point) {

        var movementVector = this.get_vector_to(point);
        //movementVector.length = speed;
        this.rotate_centroid(movementVector.angle);

        return movementVector;
    }
*/
}

Path.Triangle.prototype = Object.create(Path.prototype);
Path.Triangle.prototype.constructor = Path.Triangle;

///////////////////////// Boid /////////////////////////////

Boid = function Boid(p1, p2, p3, color, headIndex, initSpeed) {
    
    // if headIndex > 2 and headIndex < 0 throw exeption!

    Path.Triangle.call(this, p1, p2, p3);

    this.strokeColor = color;

    var getMovementVector = function() {

        var vertices = [p1, p2, p3];
        var head = vertices.splice(headIndex, 1);

        var x0, y0, x1, x2, y1, y2;
    
        if (vertices[0].x > vertices[1].x) {
            x1 = vertices[0].x;
            x2 = vertices[1].x; 
        }
        else {
            x1 = vertices[1].x;
            x2 = vertices[0].x; 
        }
    
        if (vertices[0].y > vertices[1].y) {
            y1 = vertices[0].y;
            y2 = vertices[1].y; 
        }
        else {
            y1 = vertices[1].y;
            y2 = vertices[0].y; 
        }
    
        x0 = x1 + (x2 - x1) / 2;
        y0 = y1 + (y2 - y1) / 2;
    
        var mv = head[0] - new Point(x0, y0);
        mv.length = initSpeed;

        return mv;
        //this.prevAngle = movementVector.angle;
    }

    this.movementVector = getMovementVector();
    this.prevAngle = this.movementVector.angle;

    this.changeAngle = function(delta) {

        this.movementVector.angle += delta;

        this.rotate_centroid(-this.prevAngle);
        this.rotate_centroid(this.movementVector.angle);
        this.prevAngle = this.movementVector.angle;
    }

    this.getNextPos = function() {

        return this.get_centroid() + this.movementVector;
    }
}

Boid.prototype = Object.create(Path.Triangle.prototype);
Boid.prototype.constructor = Boid;

////////////////////////////////////////////////////////////

var boid = new Boid(
    new Point(0, 60),
    new Point(8, 30),
    new Point(16, 60),
    'white', 1, 1
);
boid.move_to(view.center);

// aligning boid along X axys (0 degrees)
//boid.rotate_centroid(90);

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


var createWanderer = function(speed) {

    var decision = getDecision("");
    var directionChangingTime = Date.now() + decision.interval;

    // movementVector represents movement direction (angle) and speed (length)
    // var movementVector = boid.get_vector_to(decision.dest);
    // movementVector.length = speed;
    // boid.rotate_centroid(movementVector.angle);


    // saving current angle in order to return it back to 0 degree by rotating boid back later
    // var prevMovementVectorAngle = movementVector.angle;
    

    return {
        execute: function onFrame(event) {
            
            // is it time to change direction?
            if (Date.now() >= directionChangingTime) {
                //movementVector.angle += decision.degree;
                boid.changeAngle(decision.degree);
                decision = getDecision("");
                directionChangingTime = Date.now() + decision.interval;

                // rotating boid "back" to 0 degrees
                // boid.rotate_centroid(-prevMovementVectorAngle);
                // boid.rotate_centroid(movementVector.angle);
                // prevMovementVectorAngle = movementVector.angle;
            }

            //var nextPos = boid.get_centroid() + movementVector;
            var nextPos = boid.getNextPos();
            //console.log(nextPos);


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
