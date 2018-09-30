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
}

Path.Triangle.prototype = Object.create(Path.prototype);
Path.Triangle.prototype.constructor = Path.Triangle;

///////////////////////// Boid /////////////////////////////

Boid = function Boid(p1, p2, p3, color, headIndex, initSpeed, action) {
    
    // if headIndex > 2 and headIndex < 0 throw exeption!

    Path.Triangle.call(this, p1, p2, p3);

    this.strokeColor = color;

    // movementVector represents movement direction (angle) and speed (length)
    this.movementVector = (function(v1, v2, v3, headPos, speed, center) {

        var vertices = [v1, v2, v3];
        var head = vertices.splice(headPos, 1);
    
        var mv = head[0] - center;
        mv.length = speed;

        return mv;
    })(p1, p2, p2, headIndex, initSpeed, this.get_centroid());


    this.changeAngle = (function() {

        // saving current angle in order to return it back to 0 degree by rotating boid back later
        var prevAngle = this.movementVector.angle;

        return function (delta) {

            this.movementVector.angle += delta;

            // rotating boid "back" to 0 degrees
            this.rotate_centroid(-prevAngle);
            this.rotate_centroid(this.movementVector.angle);
            prevAngle = this.movementVector.angle;
        }
    }.bind(this))();

    this.getNextPos = function() {

        return this.get_centroid() + this.movementVector;
    }

    this.move = function() {

        action(function(decision) {

            if (decision.changed) {

                console.log("angle changed on " + decision.degree);
                this.changeAngle(decision.degree);
            }

            //console.log("action");

            var nextPos = this.getNextPos();

            // jumping t0 the "other side" of the screen
            var jumpPos;

            // you can send boundaries to the boid as a context...
            if (nextPos.x <= 0) jumpPos = new Point(view.size.width, nextPos.y);
            else if (nextPos.x >= view.size.width) jumpPos = new Point(0, nextPos.y);
            else if (nextPos.y <= 0) jumpPos = new Point(nextPos.x, view.size.height);
            else if (nextPos.y >= view.size.height) jumpPos = new Point(nextPos.x, 0);
            else jumpPos = nextPos;

            this.move_to(jumpPos);

        // creating a copy with [this]
        }.bind(this));
    }
}

Boid.prototype = Object.create(Path.Triangle.prototype);
Boid.prototype.constructor = Boid;

////////////////////////////////////////////////////////////

var boid = new Boid(
    new Point(0, 60),
    new Point(8, 30),
    new Point(16, 60),
    'white', 1, 1, dm2.map
);
boid.move_to(view.center);


new Path.Circle(view.center, 2).fillColor = 'red';

function onFrame(event) {

    boid.move();
}
