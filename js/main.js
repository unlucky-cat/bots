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