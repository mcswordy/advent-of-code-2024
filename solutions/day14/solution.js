const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const lines = data.split(/\r?\n/).map(l=> l.split(' '));
    let xMax = 101;
    let yMax =  103;
    let xMid = (xMax-1)/2;
    let xl = xMid - (xMid/2);
    let xr = xMid + (xMid/2);
    let robots = lines.map((l,i) => {
        let robot = {};
        for (let param of l) {
            let pType = param.substring(0,1);
            let coords = param.substring(2).split(',');
            let x = parseInt(coords[0]);
            let y = parseInt(coords[1]);
            robot[pType] = {x,y};
        }
        return robot
    })
    let numR = robots.length;
    for (let n = 0;n < 1000000;n++) {
        // console.log('n',n);
        for (let i = 0;i<robots.length;i++) {
            let robot = robots[i];
            let {p,v} = robot;
            let {x,y} = p;
            let {x:xv,y:yv} = v;
            x+=xv;
            y+=yv;
            x = x % xMax;
            y = y % yMax;
            if (x<0) {x+=xMax}
            if (y<0) {y+=yMax}
            robots[i].p = {x,y};
        }
        // Find line of at least length 20 to indicate possible frame;
        let hasLongLine = false;
        let robotsSort = robots.sort(function (a, b) {
               return a.p.y - b.p.y
            || a.p.x - b.p.x;
        });
        // console.log('robotsSort',robotsSort);
        let t = 0;
        let lineEnd;
        for (let i = 1; i< robotsSort.length;i++) {
            let p1 = robotsSort[i-1].p;
            let p2 = robotsSort[i].p;
            if (p1.y===p2.y && p1.x +1 === p2.x) {
                t+=1;
                if (t >= 20) {
                    hasLongLine = true;
                }
            } else {
                // if it was a long line & even number, finish it
                if (hasLongLine && t%2===0) {
                    lineEnd = p1;
                    break;
                } else {
                  // start again
                  hasLongLine = false;
                  t = 0;
                }
            }
        }
        if (hasLongLine) {
            console.log('n with long line',n,t,lineEnd)
            // check for x symmetry at middle x coords!
            let symmetry = true;
            let xC = lineEnd.x - (t/2);
            console.log('xC,lineEnd',xC,lineEnd);
            let numSymmetrical = 0;
            for (let r of robots) {
                let {x,y} = r.p;
                let altX = xC - (x-xC);
                // if (x===0) {console.log('x,altX',x,altX)};
                let match = robots.filter(r2=>r2.p.x===altX && r2.p.y===y).length > 0;
                if (match) {numSymmetrical +=1}
            }
            if (numSymmetrical > (numR/2)) {
                // display!
                console.log('potential Tree',n,xC);
                let emptyLine = [...Array(xMax).keys()]
                for (let i = 0; i < yMax;i++) {
                    let line = emptyLine.map((j) => {
                        let match = robots.filter(r=>r.p.x===j && r.p.y===i).length > 0;
                        let res = match ? 'o' : '_';
                        return res
                    })
                    console.log('line',line.join(''));
                }
                break;
            }
        }
    }
  });



//    // Should contain say 10 horizontal lines (at several y)
//    let ysWithLines = [];
//    for (let r of robots) {
//        let {x,y} = r.p;
//        if (!(ysWithLines.includes(y))) {
//            let hMatch = robots.filter(r2=>r2.p.y===y && r2.p.x !== x).length > 0;
//            if (hMatch) {ysWithLines.push(y);}
//        }
//    }
//    if (hasVerticalLines) {
//        continue;
//    }