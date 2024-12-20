const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    let bytes = data.split(/\r?\n/).map(p=>p.split(',')).map(p=>([parseInt(p[0]),parseInt(p[1])]));
    let xMax = 70;
    let yMax = 70;
    bytes = bytes.slice(0, 1024);
    console.log('bytes',bytes)

    // parameters
    let start = [0,0];
    let end = [xMax,yMax];
    let moves = [[1,0],[0,1],[-1,0],[0,-1]]

    // find shortest path which avoids above coords
    let paths = [{p:start,m:0,locs:[start]}];
    let n = 1;
    let done = false;
    while (n < 1000) {
        console.log('n',n);
        let pathsTemp = paths.filter(p=>p.m===n-1);
        if (pathsTemp.length ===0) { break}
        // console.log('n',n,'pathsTemp',pathsTemp.map(p=>p.locs.join('|')))
        for (let path of pathsTemp) {
            // console.log('path start')
            let {p,locs} = path;
            for (let move of moves) {
                let newP = [p[0] + move[0],p[1] + move[1]]
                // console.log('newP',newP)
                if (newP[0] < 0 || newP[0] > xMax || newP[1] < 0 || newP[1] > yMax) {
                    // console.log('Outside grid!')
                    continue
                } else if (bytes.filter(b=>b[0]===newP[0] && b[1]===newP[1]).length > 0) {
                    // console.log('Byte here!')
                    continue
                }  else if (locs.filter(l=>l[0]===newP[0] && l[1]===newP[1]).length > 0) {
                    // console.log('Already in same path!')
                    continue
                } else if (paths.filter(path=>path.p[0]===newP[0] && path.p[1]===newP[1]).length > 0) {
                    // console.log('Earlier path already been here!')
                    continue
                } else {
                    // console.log('OK!')
                    let newLocs = [...locs]
                    newLocs.push(newP);
                    paths.push({p:newP,m:n,locs:newLocs})
                    if (newP[0]===end[0] && newP[1]===end[1]) {
                        console.log('Reached end!')
                        done = true;
                        break
                    }
                }
            }
            if (done) {break}
        }
        if (done) {break}
        n++;
    }
    console.log('n',n,'solution',path[path.length-1])
});
