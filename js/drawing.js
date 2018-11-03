////////////////////// LinesBox //////////////////////

LinesBox = function LinesBox() {

    var lines = [];

    this.AddPoints = function(point1, point2, color, width) {

        var ln = new Path.Line(point1, point2);
        ln.strokeColor = color;
        ln.strokeWidth = width;

        this.AddLine(ln);

        return ln;
    }

    this.AddLine = function(line) {

        lines.push(line);
    }

    this.Clean = function() {

        lines.forEach(function (l) {
            l.remove();
        });
        lines.length = 0;
    }
}

/////////////////////// Vector ///////////////////////

Point.Vector = function Vector(x, y) {
    Point.call(this, x, y);

    this.HasTheSameDirectionWith = function(vector, angle) {

        if (angle === undefined) angle = 70;

        var diffAngleBetween = Math.abs(this.angle - vector.angle);
        if (diffAngleBetween > 180) diffAngleBetween = 360 - diffAngleBetween;

        return diffAngleBetween <= angle;
    }

    this.HasOppositeDirectionWith = function(vector, angle) {

        if (angle === undefined) angle = 80;

        var diffAngleBetween = Math.abs(this.angle - vector.angle);
        if (diffAngleBetween > 180) diffAngleBetween = 360 - diffAngleBetween;

        return diffAngleBetween > angle;
    }
}

Point.Vector.prototype = Object.create(Point.prototype);
Point.Vector.prototype.constructor = Point.Vector;

Point.Vector.CloneFromPoint = function(point) {
    return new Point.Vector(point.x, point.y);
};

///////////////////////// Zero /////////////////////////

Point.Zero = function Zero() {
    Point.call(this, 0, 0);
}

Point.Zero.prototype = Object.create(Point.prototype);
Point.Zero.prototype.constructor = Point.Zero;

////////////////////// Triangle //////////////////////

Path.Triangle = function Triangle(p1, p2, p3) {
    Path.call(this, [p1, p2, p3]);
    this.closed = true;

    this.onMove = [];

    this.get_centroid = function() {
        var x = this.segments.reduce(function(acc, curr) { return acc + curr.point.x; }, 0);
        var y = this.segments.reduce(function(acc, curr) { return acc + curr.point.y; }, 0);
    
        return new Point.Vector(x/3, y/3);
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

    var p1 = new Point.Vector(0, 60);
    var p2 = new Point.Vector(8, 30);
    var p3 = new Point.Vector(16, 60);

    Path.Triangle.call(this, p1, p2, p3);
    this.distanceToScan = 120;
    this.smootheningFactor = 1500;
    this.repulsionAngle = 30; // flock member can be a little behind (v-shaped field of view)
    this.attractionAngle = 60; // leader should be a little ahead (v-shaped field of view)
/*
    var circle = new Path.Circle(this.get_centroid(), distanceToScan);
    circle.strokeColor = color;
    circle.strokeWidth = .5;
    circle.dashArray = [3, 20];
*/
    var center = new Path.Circle(this.get_centroid(), 2);
    center.strokeColor = color;

    var linesBox = new LinesBox();
    var linesBox2 = new LinesBox();
    
    this.onMove.push(function(pos) {
        //circle.position = pos;
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

        return Point.Vector.CloneFromPoint(mv);
    })(p1, p2, p2, headIndex, initSpeed, this.get_centroid());


    this.changeAngle = (function() {

        // saving current angle in order to return it back to 0 degree by rotating boid back later
        var prevAngle = this.movementVector.angle;

        return function (value, isDelta) {

            if (isDelta === true) this.movementVector.angle += value;
            else this.movementVector.angle = value;

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
        if (nextPos.x <= 0) jumpPos = new Point.Vector(view.size.width, nextPos.y);
        else if (nextPos.x >= view.size.width) jumpPos = new Point.Vector(0, nextPos.y);
        else if (nextPos.y <= 0) jumpPos = new Point.Vector(nextPos.x, view.size.height);
        else if (nextPos.y >= view.size.height) jumpPos = new Point.Vector(nextPos.x, 0);
        else jumpPos = nextPos;

        return jumpPos;
    }

    this.getRepulsionForces = function(obstacles) {

        var centroid = this.get_centroid();
        var name = this.name;
        var init_force = new Point.Zero();

        linesBox.Clean();
    
        return this.flock
        .filter(function (flock_boid) {
            return name !== flock_boid.name;
        })
        // filtering the boids: (visible)
        // those are facing opposite directions (butt ignoring)
        .filter(function(flock_boid) {

            return this.movementVector.HasOppositeDirectionWith(flock_boid.movementVector)
        }.bind(this))
        .map(function (flock_boid) {
            return flock_boid.get_centroid();
        })
        .concat(obstacles)
        .filter(function(flock_centroid) {

            var vectorBetween = flock_centroid - centroid;
    
            return vectorBetween.length > 0 
                && vectorBetween.length <= this.distanceToScan
                && this.movementVector.HasTheSameDirectionWith(vectorBetween, this.repulsionAngle)
        }.bind(this))
        .reduce(function (accumulativeVector, flock_centroid) {
            // repulsive direction (from flock member)
            var vectorBetween = centroid - flock_centroid;
            // repulsion force is inversely proportional to the distance between objects
            vectorBetween.length = this.distanceToScan - vectorBetween.length;
    
            //drawVectorFromPoint(flock_centroid, centroid, 'yellow');   
            /*
            var ln = new Path.Line(flock_centroid, centroid);
            ln.strokeColor = color;
            ln.strokeWidth = 0.3;
            lines.push(ln);
            */
            //new Path.Circle(vector, 2).strokeColor = color;   

            linesBox.AddPoints(flock_centroid, centroid, color, 0.3);
    
            return accumulativeVector + vectorBetween;
        }.bind(this), init_force);
    }

    this.getAttractionForces = function() {

        var centroid = this.get_centroid();
        var name = this.name;
        var zero_force = new Point.Zero();
    
        linesBox2.Clean();

        var minVector =  this.flock
        .filter(function (flock_boid) {
            return name !== flock_boid.name;
        })
        // filtering the boids: (visible)
        // those are in the bounds of the "attractionAngle" (in a field of view)
        // those are not further then the "distanceToScan" (in the distance)
        // and those are facing the same direction (butt attraction)
        .filter(function(flock_boid) {
            
            var flock_centroid = flock_boid.get_centroid();           
            var vectorBetween = flock_centroid - centroid;
    
            return vectorBetween.length > 0 
                && vectorBetween.length <= this.distanceToScan
                && this.movementVector.HasTheSameDirectionWith(flock_boid.movementVector)
                && this.movementVector.HasTheSameDirectionWith(vectorBetween, this.attractionAngle)
        }.bind(this))
        .map(function (flock_boid) {
            return flock_boid.get_centroid();
        })
        // searching for a closest flock member
        .reduce(function (closestMemberVector, flock_centroid) {
            
            // attractive direction (to flock member)
            var vectorBetween = flock_centroid - centroid;  
            var minLength = closestMemberVector.length;

            // we need to maximize zero_force in order it doesn't win
            if (closestMemberVector === zero_force) minLength = Number.MAX_SAFE_INTEGER;

            return vectorBetween.length < minLength ? vectorBetween : closestMemberVector;

        }, zero_force);


        // if we found something
        if (minVector !== zero_force) {
            var flock_centroid = centroid + minVector;

            linesBox2
            .AddPoints(flock_centroid, centroid, color, 1)
            .dashArray = [3, 10];

            // attraction force is inversely proportional to the distance between objects
            minVector.length = this.distanceToScan - minVector.length;
        }

        return minVector;
    }

    this.move = function(obstacles) {

        action(function(decision) {

            if (decision.changed) {

                //console.log(this.name + "'s - angle changed on " + decision.degree);
                this.changeAngle(decision.degree, true);
            }

            var repulsion = this.getRepulsionForces(obstacles);
            repulsion /= this.smootheningFactor;

            var attraction = this.getAttractionForces();
            attraction /= (this.smootheningFactor / 2);

            var totalCorrection = repulsion + attraction;

            // i should ONLY correct the movement ANGLE, but not it's length (speed)
            var correctionAngle = (this.movementVector + totalCorrection).angle;

            this.changeAngle(correctionAngle, false);

            this.move_to(calcJumpPoint(this.getNextPos()));

        }.bind(this));
    }

    this.addToFlock = function() {
        this.flock.push(this);

        return this;
    }

    this.move_to(position);
    this.changeAngle(angle, false);
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

var speed = .8;
new Boid('white', 'boid1', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('red', 'boid2', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('lime', 'boid3', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('blue', 'boid4', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('yellow', 'boid5', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('magenta', 'boid6', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('aqua', 'boid7', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('blueviolet', 'boid8', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('crimson', 'boid9', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('gold', 'boid10', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('orange', 'boid11', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();
new Boid('pink', 'boid12', getRandomPoint(), getRandomAngle(), 1, speed, dm2().map).addToFlock();

// Boid.prototype.flock.forEach(function(boid) { boid.move_to(view.center); })

new Path.Circle(view.center, 2).fillColor = 'red';

var obstacles = [view.center];

function onFrame(event) {

    Boid.prototype.flock.forEach(function(boid) {
        boid.move(obstacles);
    });
}
