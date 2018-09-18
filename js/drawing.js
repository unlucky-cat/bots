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
var callDecisionMakerForDestination = function(context)
{
    return dm.map(context, function(dest)
    {
        return new Point(dest.x, dest.y) * view.size;
    });
};

var createJumper = function(speed) {

    var destination = callDecisionMakerForDestination("");
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
                destination = callDecisionMakerForDestination("");
                vector = destination - boid.position;
                boid.rotate(prevAngle);
                boid.rotate(vector.angle);
                prevAngle = -vector.angle;
            }
        }
    }
}


var createWanderer = function(speed) {

    var destination = callDecisionMakerForDestination("");
    var vector = destination - boid.position;
    vector.length = speed;
    boid.rotate(vector.angle);

    return {
        execute: function onFrame(event) {
        
            var nextPos = boid.position + vector;
            var jumpPos;

            if (nextPos.x <= 0) jumpPos = new Point(view.size.x, nextPos.y);
            else jumpPos = nextPos;

            jumpPos = nextPos;
            boid.position = jumpPos;
        }
    }
}


//var action = createJumper(1);
var action = createWanderer(1);

function onFrame(event) {

    action.execute(event);
}
