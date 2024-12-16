const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const lines = data.split(/\r?\n/);

    // Parse machines
    let As = [];
    let Bs = [];
    let prizes = [];
    let n = 0;
    for (let line of lines) {
        let words = line.split(' ');
        if (['A:','B:'].includes(words[1])) {
            let x = parseInt(words[2].substring(1, words[2].length-1));
            let y = parseInt(words[3].substring(1, words[3].length));
            if (words[1]==='A:') {As.push({x,y})};
            if (words[1]==='B:') {Bs.push({x,y})};
        } else if (words[0] === 'Prize:') {
            let x = parseInt(words[1].substring(2, words[1].length-1));
            let y = parseInt(words[2].substring(2, words[2].length));
            prizes.push({x,y})
            n++;
        }
    }

    let totalCost = 0;
    // Loop over machines
    for (let i = 0;i< prizes.length;i++) {
        let A=As[i];
        let B=Bs[i];
        let prize=prizes[i];
        console.log('A,B,prize',A,B,prize);
        let {x:X,y:Y} = prize;
        let nMax = X/A.x;
        let mMax = X/B.x;
        console.log('nMax,mMax',nMax,mMax);
        let solutions = [];
        for (n = 0;n<=nMax +1;n++) {
            let Ax = n*A.x;
            let Ay = n*A.y;
            if (Ax > X || Ay >Y) {
                break
            }
            for (m = 0;m<=mMax + 1;m++) {
                let Bx = m*B.x;
                let By = m*B.y;
                let xIn = Ax + Bx;
                let yIn = Ay + By;
                if (xIn === X && yIn === Y) {
                    let cost = 3*n + 1*m;
                    solutions.push(cost);
                    totalCost +=cost;
                }
            }
        }
    }
    console.log('totalCost',totalCost);
    
  });
