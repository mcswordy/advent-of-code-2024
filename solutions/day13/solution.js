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
        X+=10000000000000;
        Y+=10000000000000;
        console.log('X,Y',X,Y);
        let x1 = A.x;
        let x2 = B.x;
        let y1 = A.y;
        let y2 = B.y;
        let nominator = x1*Y - X*y1;
        let denominator = x1*y2 - x2*y1;
        console.log('nominator',nominator);
        console.log('denominator',denominator);
        let m = nominator/denominator;
        console.log('m',m);

        let nominator2 = X-(m*x2);
        let denominator2 = x1;
        console.log('nominator2',nominator2);
        console.log('denominator2',denominator2);
        let n = nominator2/denominator2;
        console.log('n',n);

        if (m === Math.floor(m) && n=== Math.floor(n)) {
            cost = 3*n + 1*m;
            totalCost+=cost;
        }

    }
    console.log('totalCost',totalCost);
  });
