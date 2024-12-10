const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    // ^>v<#
    const lines = data.split(/\r?\n/).map(l=> l.split(''));
    let i;
    let j;
    for (k=0;k<lines.length;k++) {
        let l = lines[k];
        let m = l.indexOf('^');
        if (m>=0) {
            i = k;
            j=m;
        }
    };
    let numLines= lines.length;
    let numCols = lines[0].length;
    console.log('i,j',i,j);
    let direction = '^';
    let turn = (dir) => {
        if (dir === '^') {return '>'}
        if (dir === '>') {return 'v'}
        if (dir === 'v') {return '<'}
        if (dir === '<') {return '^'}
    }
    let n = 0;
    lines[i][j] = 'X'
    while (n < 10000) {
        // find next position
        let y,x;
        if (direction ==='^') {
            y=i-1
            x=j
        }
        else if (direction === 'v') {
            y=i+1
            x=j
        }
        else if (direction === '>') {
            x=j+1
            y=i
        }
        else if (direction === '<') {
            x=j-1
            y=i
        }
        if (x < 0 || x > numCols || y < 0 || y > numLines) {
            break
        }
        let val = lines[y][x];
        if (val==='#') {
            console.log('turning!',direction);
            direction = turn(direction);
            console.log('turned!',direction);
        } else {
            console.log('moving',i,j,y,x);
            lines[y][x] = 'X'
            i=y;
            j=x;
        }
        n += 1;
    }
    let nPlaces = 0;
    for (let line of lines) {
        for (let c of line) {
            if (c==='X') {
                nPlaces += 1;
            }
        }
    }
    console.log('nPlaces',nPlaces);
    console.log('lines',lines.map(l=> l.join('')));
  });