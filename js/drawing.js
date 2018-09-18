// Create a centered text item at the center of the view:
var boid = new Path();
boid.strokeColor = 'white';
boid.add(new Point(0, 60));
boid.add(new Point(8, 30));
boid.add(new Point(16, 60));
boid.scaling *= 0.5;
boid.closed = true;
boid.position = view.center;

// aligning boid along X axys (0 degrees)
boid.rotate(90);

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

var createJumper = function(speed) {

    var destination = getDecision("").dest;
    var vector = destination - boid.position;

    // saving current angle in order to return it back to 0 degree by rotating boid back later
    var prevAngle = -vector.angle;
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
                boid.rotate(prevAngle);
                boid.rotate(vector.angle);
                prevAngle = -vector.angle;
            }
        }
    }
}


var createWanderer = function(speed) {

    var decision = getDecision("");
    var vector = decision.dest - boid.position;
    var targetTime = Date.now() + decision.interval;
    vector.length = speed;

    // saving current angle in order to return it back to 0 degree by rotating boid back later
    var prevAngle = -vector.angle;
    boid.rotate(vector.angle);

    return {
        execute: function onFrame(event) {
                  
            if (Date.now() >= targetTime) {
                vector.angle += decision.degree;
                decision = getDecision("");
                targetTime = Date.now() + decision.interval;

                boid.rotate(prevAngle);
                boid.rotate(vector.angle);
                prevAngle = -vector.angle;
            }

            var nextPos = boid.position + vector;
            var jumpPos;

            if (nextPos.x <= 0) jumpPos = new Point(view.size.width, nextPos.y);
            else if (nextPos.x >= view.size.width) jumpPos = new Point(0, nextPos.y);
            else if (nextPos.y <= 0) jumpPos = new Point(nextPos.x, view.size.height);
            else if (nextPos.y >= view.size.height) jumpPos = new Point(nextPos.x, 0);
            else jumpPos = nextPos;

            //jumpPos = nextPos;
            boid.position = jumpPos;
        }
    }
}


//var action = createJumper(1);
var action = createWanderer(1);

function onFrame(event) {

    action.execute(event);
}
