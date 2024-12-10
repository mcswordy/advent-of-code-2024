const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const lines = data.split(/\r?\n/).map(l=> l.split('').map(i =>parseInt(i)));
    // console.log('lines',lines)
    let total = 0;
    let moves = [{a:1,b:0},{a:0,b:1},{a:-1,b:0},{a:0,b:-1}];
    let numRows = lines.length;
    let numCols = lines[0].length;
    for (let i=0;i< lines.length;i++) {
        let line = lines[i];
        // console.log('line',line);
        for (let j=0;j< lines.length;j++) {
            if (line[j]===0) {
                console.log('starting pos',i,j)
                let trails = [[{x:i,y:j}]];
                let score = 0;
                let n = 1;
                while (n <= 9) {
                    let lastTrails = trails.slice().filter(t=>t.length === n);
                    // console.log('n',n);
                    // console.log('lastTrails',lastTrails);
                    let numNew = 0;
                    for (let k = 0;k < lastTrails.length;k++) {
                        let trail = [...lastTrails[k]]
                        let {x,y} =  trail[trail.length - 1];
                        for (let move of moves) {
                            let a = x + move.a;
                            let b = y + move.b;
                            if (a < numRows && a >= 0 && b < numCols && b >= 0) {
                                let newVal = lines[a][b]
                                // console.log('newVal',newVal);
                                if (newVal===n) {
                                    let trailCopy = [...trail]
                                    trailCopy.push({x:a,y:b});
                                    trails.push(trailCopy);
                                    numNew ++;
                                }
                            }
                        }
                    }
                    if (numNew===0) {
                        break
                    } else if (n===9) {
                        let res = trails.filter(t=>t.length === 10).map(t => t[9]);
                        console.log('res',res);
                        let uniqueRes = [];
                        for (let r of res) {
                            if (uniqueRes.filter(u=> u.x===r.x && u.y===r.y).length ===0) {
                                uniqueRes.push({x:r.x,y:r.y})
                            }
                        }
                        // console.log('uniqueRes',uniqueRes);
                        score = res.length;
                        console.log('score',score);
                    }
                    n++
                }
                total += score;
            }
        }
    }
    console.log('total',total);
  });