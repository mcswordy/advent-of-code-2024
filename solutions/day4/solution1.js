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
    for (let i = 0;i < numLines;i++) {
        for (let j = 0;j < numCols;j++) {
            let _1 = lines[i][j];
            if (_1 === 'X') {
                for (let ic of changes) {
                    for (let jc of changes) {
                        let match = true;
                        for (let n = 1;n<=3;n++) {
                            let letterMatch = false;
                            let l = 'XMAS'[n]
                            let ni = i + (n*ic);
                            let nj = j + (n*jc);
                            if (ni >= 0 && ni < numLines && nj >= 0 && nj < numCols) {
                                let val = lines[ni][nj]
                                if (val ===l) {
                                    letterMatch = true
                                }
                            }
                            if (!letterMatch) {
                                match = false
                            }
                        }
                        if (match) {
                            numMatches += 1
                        }
                    }
                }
            }
        }
    }
    console.log('numMatches',numMatches)
  });