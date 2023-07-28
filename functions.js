module.exports.group_by = function group_by(a, k) {
 
    return a.reduce(function (totPrev, obj) {
        let key = obj[k];
        if (!totPrev[key]) {
            totPrev[key] = [];
        }
        totPrev[key].push(obj)
        return totPrev;
    }, {})

}
module.exports.find_by = function find_by(a, f) {

    let result = [];
    let ks = [],
        vs = [];
    var check = true;
    for ([key, value] of Object.entries(f)) {
        if (value !== undefined && value !== null) {
            ks.push(key);
            vs.push(value);
        }
    }
    if (f == undefined) return result;
    a.filter(function (obj) {
        for (var i = 0; i < ks.length; i++) {
         //   console.log(obj[ks[i]] + vs[i])
            if (obj[ks[i]] != vs[i]) {
                check = false;
                i = ks.length;
            } else {
                check = true;
            }
        }
        //console.log(result)
        if (check == true) { result.push(obj) }
    });
    return result;
}

module.exports.format_seconds = function format_seconds(s) {
   var sec = 0;
   var calc = 0, min = 0;


   if (s == undefined || isNaN(s) == true || s === "" || Array.isArray(s)) {
      return "?:??";
   }
   if (s == 0) {
      return "0:00";
   }

   if (s % 1 != 0) {
      let temp = s.toString().split(".");
      s = temp[0];
   }
   calc = s / 60;

   if (calc % 1 != 0) {
      let temp2 = calc.toString().split(".");
      min = temp2[0];
      var calcoloS = 60 * min;
      sec = s - calcoloS;
      if (s < 0) {
         if (sec > -10)
            return min + ":0" + (sec * -1);
         else
            return min + ":" + (sec * -1);
      }
      if (sec < 10)
         return min + ":0" + sec;

      return min + ":" + sec;
   }
   else {
      min = calc;
      return min + ":00";
   }
}

