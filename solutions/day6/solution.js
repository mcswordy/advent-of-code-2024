const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    // ^>v<#
    const lines1 = data.split(/\r?\n/).map(l=> l.split(''));
    let i1;
    let j1;
    for (k=0;k<lines1.length;k++) {
        let l = lines1[k];
        let m = l.indexOf('^');
        if (m>=0) {
            i1 = k;
            j1=m;
        }
    };
    let numLines= lines1.length;
    let numCols = lines1[0].length;
    console.log('i1,j1',i1,j1);
    console.log('numLines,numCols',numLines,numCols);
    let direction1 = '^';
    let turn = (dir) => {
        if (dir === '^') {return '>'}
        if (dir === '>') {return 'v'}
        if (dir === 'v') {return '<'}
        if (dir === '<') {return '^'}
    }
    let lines = JSON.parse(JSON.stringify(lines1));
    let direction = direction1;
    let i = i1;
    let j = j1;
    lines[i][j] = 'X';
    // find everywhere they went
    let m = 0;
    while (m < 10000) {
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
        if (x < 0 || x >= numCols || y < 0 || y >= numLines) {
            break
        }
        let val = lines[y][x];
        if (val==='#') {
            direction = turn(direction);
        } else {
            lines[y][x] = 'X'
            i=y;
            j=x;
        }
        m += 1;
    }
    
    let loops = 0;
    for (let a = 0;a < numLines;a++) {
        for (let b = 0;b<numCols;b++) {
            let val = lines[a][b];
            if (val ==='X') {
                console.log('a,b',a,b);
                let tLines = JSON.parse(JSON.stringify(lines1));
                tLines[a][b] = 'O';
                let ti = i1;
                let tj = j1;
                let tdirection = direction1;
                let visitedPositions = [{i:ti,j:tj,direction:tdirection}];
                let n = 0;
                while (n < 20000) {
                    let y,x;
                    if (tdirection ==='^') {
                        y=ti-1
                        x=tj
                    }
                    else if (tdirection === 'v') {
                        y=ti+1
                        x=tj
                    }
                    else if (tdirection === '>') {
                        y=ti
                        x=tj+1
                    }
                    else if (tdirection === '<') {
                        y=ti
                        x=tj-1
                    }
                    if (x < 0 || x >= numCols || y < 0 || y >= numLines) {
                        break
                    }
                    let val = tLines[y][x];
                    if (val==='#' || val ==='O') {
                        // console.log('turning!',tdirection);
                        tdirection = turn(tdirection);
                    } else {
                        // console.log('moving',ti,tj,y,x);
                        tLines[y][x] = 'X'
                        ti=y;
                        tj=x;
                    }
                    if (visitedPositions.filter(p=> p.i===ti && p.j===tj & p.direction === tdirection).length > 0) {
                        loops+=1;
                        tLines[ti][tj] = tdirection;
                        // console.log('loop res',n,tLines.map(l => l.join('')))
                        break
                    } else {
                        visitedPositions.push({i:ti,j:tj,direction:tdirection});
                    } if (n===19999) {console.log('n Max!')}
                    n ++;
                }
            }
        }
    }
    console.log('loops',loops);
    //2637
  });