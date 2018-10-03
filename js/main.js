var dm = (function() {

    return {
        map: function(context, callback)
        {
            let dest = {
                x: Math.random(),
                y: Math.random(),
                interval: 500 + Math.random() * 1500, // from 500 to 2000 millis
                degree: Math.random() * 10 - 5, // +- 5 degrees
            };

            // console.log(context);
            return callback(dest);
        }
    }

})();

var dm2 = function() {

    // from 500 to 2000 millis
    var getRandomInterval = function(base) {

        return base + (500 + Math.random() * 15000);
    }

    var initTime = getRandomInterval(Date.now());

    return {
        map: function(callback)
        {
            var isActionTime = false;

            if (initTime < Date.now()) {

                isActionTime = true;
                initTime = getRandomInterval(Date.now())
            }

            var dest = {
                changed: isActionTime,
                // +- 5 degrees
                degree: isActionTime ? Math.random() * 10 - 5 : 0
            };

            // console.log(context);
            callback(dest);
        }
    }

};


var x = (function() {

    var f = function () {
        return 2 + Math.random() * 3; 
    }

    this.init = f();

    return {
        y: function() {
            console.log(init++)
        }
    }
})();