////////////////////// Triangle //////////////////////

Path.Triangle = function Triangle(p1, p2, p3) {
    Path.call(this, [p1, p2, p3]);
    this.closed = true;

    this.onMove = [];

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

        this.onMove.forEach(function(func) {
            func(this.get_centroid());
        }.bind(this));
    }

    this.rotate_centroid = function(angle) {
        this.rotate(angle, this.get_centroid());
    }
}

Path.Triangle.prototype = Object.create(Path.prototype);
Path.Triangle.prototype.constructor = Path.Triangle;

///////////////////////// Boid /////////////////////////////

Boid = function Boid(color, name, position, angle, headIndex, initSpeed, action) {
    
    // if headIndex > 2 and headIndex < 0 throw exeption!

    var p1 = new Point(0, 60);
    var p2 = new Point(8, 30);
    var p3 = new Point(16, 60);

    Path.Triangle.call(this, p1, p2, p3);
    this.distanceToScan = 100;

    var circle = new Path.Circle(this.get_centroid(), 100);
    circle.strokeColor = color;
    circle.strokeWidth = .5;
    circle.dashArray = [3, 20];

    var center = new Path.Circle(this.get_centroid(), 2);
    center.strokeColor = color;

    var lines = [];
    
    this.onMove.push(function(pos) {
        circle.position = pos;
        center.position = pos;

        //console.log(pos);
    });

    this.strokeColor = color;
    this.name = name;

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

    var calcJumpPoint = function(nextPos) {

        // jumping t0 the "other side" of the screen
        var jumpPos;

        // you can send boundaries to the boid as a context...
        if (nextPos.x <= 0) jumpPos = new Point(view.size.width, nextPos.y);
        else if (nextPos.x >= view.size.width) jumpPos = new Point(0, nextPos.y);
        else if (nextPos.y <= 0) jumpPos = new Point(nextPos.x, view.size.height);
        else if (nextPos.y >= view.size.height) jumpPos = new Point(nextPos.x, 0);
        else jumpPos = nextPos;

        return jumpPos;
    }

    this.getAttractionForces = function() {

        var centroid = this.get_centroid();
        var name = this.name;
        var init_force = new Point(0, 0); //this.movementVector;
        var scanDistance = this.distanceToScan;

        lines.forEach(function (l) {
            l.remove();
        });
        lines.length = 0;
    
        return this.flock
        .filter(function (flock_boid) {
            return name !== flock_boid.name;
        })
        .map(function (flock_boid) {
            return flock_boid.get_centroid();
        })
        .filter(function(flock_centroid) {
            var distanceVector = centroid - flock_centroid;
    
            return distanceVector.length > 0 && distanceVector.length <= scanDistance;
        })
        .reduce(function (accumulativeVector, flock_centroid) {
            
            var distanceVector = centroid - flock_centroid;
            distanceVector.length = scanDistance - distanceVector.length;
    
            //drawVectorFromPoint(flock_centroid, centroid, 'yellow');   
            var ln = new Path.Line(flock_centroid, centroid);
            ln.strokeColor = color;
            lines.push(ln);
            //new Path.Circle(vector, 2).strokeColor = color;   
    
            return accumulativeVector + distanceVector;
        }, init_force);
    }

    var getRepulsionForces = function() {

    }

    this.move = function() {

        action(function(decision) {

            if (decision.changed) {

                //console.log(this.name + "'s - angle changed on " + decision.degree);
                this.changeAngle(decision.degree);
            }

            var correction = this.getAttractionForces();
            this.move_to(calcJumpPoint(this.getNextPos()));

        }.bind(this));
    }

    this.addToFlock = function() {
        this.flock.push(this);

        return this;
    }

    this.move_to(position);
    this.changeAngle(angle);
}

Boid.prototype = Object.create(Path.Triangle.prototype);
Boid.prototype.constructor = Boid;
Boid.prototype.flock = [];

////////////////////////////////////////////////////////////

var getRandomPoint = function() {
    return Point.random() * view.size;
}

var getRandomAngle = function() {
    return -180 + Math.random() * 180;
}

new Boid('white', 'boid1', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map).addToFlock();
new Boid('red', 'boid2', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map).addToFlock();
new Boid('lime', 'boid3', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map).addToFlock();
new Boid('blue', 'boid4', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map).addToFlock();
new Boid('yellow', 'boid5', getRandomPoint(), getRandomAngle(), 1, 1, dm2().map).addToFlock();

// Boid.prototype.flock.forEach(function(boid) { boid.move_to(view.center); })

new Path.Circle(view.center, 2).fillColor = 'red';

function onFrame(event) {

    Boid.prototype.flock.forEach(function(boid) {
        boid.move();
    });
}
