var dm = (function() {

    var x = a => a * 4;
    console.log(x(4));

    return {
        map: function(context, callback)
        {
            let dest = {
                x: Math.random(),
                y: Math.random(),
            };

            // console.log(context);
            return callback(dest);
        }
    }

})();
