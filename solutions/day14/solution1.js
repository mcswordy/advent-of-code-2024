const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const lines = data.split(/\r?\n/).map(l=> l.split(' '));
    let xMax = 101;
    let yMax =  103;
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
    console.log('robots',robots);
    for (let n = 0;n < 100;n++) {
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
        console.log('n,robots',n,robots);
    }
    let q1 = robots.filter(r=>r.p.x < (xMax-1)/2 && r.p.y < (yMax-1)/2).length;
    let q2 = robots.filter(r=>r.p.x > (xMax-1)/2 && r.p.y > (yMax-1)/2).length;
    let q3 = robots.filter(r=>r.p.x > (xMax-1)/2 && r.p.y < (yMax-1)/2).length;
    let q4 = robots.filter(r=>r.p.x < (xMax-1)/2 && r.p.y > (yMax-1)/2).length;
    console.log('qs',q1,q2,q3,q4);
    let res = q1*q2*q3*q4;
    console.log('res',res);
  });
