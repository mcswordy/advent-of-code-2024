const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    // console.log(data);
    const lines = data.split(/\r?\n/);
    let changes = [-1,0,1];
    let numLines = lines.length;
    let numCols = lines[0].length;
    let numMatches = 0;
    for (let i = 1;i < numLines-1;i++) {
        for (let j = 1;j < numCols-1;j++) {
            let A = lines[i][j];
            if (A === 'A') {
                let _tl = lines[i-1][j-1]
                let _bl = lines[i+1][j-1]
                let _tr = lines[i-1][j+1]
                let _br = lines[i+1][j+1]
                if ((_tl === 'M' && _br === 'S') || (_tl === 'S' && _br === 'M')) {
                    if ((_tr === 'M' && _bl === 'S') || (_tr === 'S' && _bl === 'M')) {
                        numMatches += 1
                    }
                }
            }
        }
    }
    console.log('numMatches',numMatches)
  });