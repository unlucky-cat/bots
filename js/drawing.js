// Create a centered text item at the center of the view:
var path = new Path();
path.strokeColor = 'white';
path.add(new Point(0, 60));
path.add(new Point(8, 30));
path.add(new Point(16, 60));
path.closed = true;

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

var destination = view.center;

function onFrame(event) {

    var vector = destination - path.position;
    
    // We add 1/30th of the vector to the position property
    // of the text item, to move it in the direction of the
    // destination point:
    path.position += vector / 30;
    
    
    if (vector.length < 5) {
        destination = callDecisionMakerForDestination("");
        path.rotate(vector.angle);
    }
}