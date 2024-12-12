const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    // let line = data.split(' ').map(i =>parseInt(i));
    const lines = data.split(/\r?\n/).map(l=> l.split(''));
    let numRows = lines.length;
    let numCols = lines[0].length;
    let regions = [];
    let n = 0;
    let moves = [{i:1,j:0},{i:-1,j:0},{i:0,j:1},{i:0,j:-1}];
    // let takenCoords = [];
    let unusedCoords = lines.map((l,i)=>(l.map((item,j)=>({i,j})))).flat(1);;
    while (n< 1000) {
        console.log('n',n,regions.length);
        let {i:x,j:y} = unusedCoords[0];
        if (x === undefined) {
            break;
        }
        let m = 0;
        let char = lines[x][y];
        let initCoord = {i:x,j:y,round:0};
        let coords = [initCoord];
        unusedCoords.shift();
        while (m< 1000) {
            let numFound = 0;
            let lastCoords = [...coords.filter(c=>c.round === m)];
            for (let coord of lastCoords) {
                let {i:a,j:b,round} = coord;
                // console.log('round,coord',round,coord);
                for (let move of moves) {
                    let aNew = a + move.i;
                    let bNew = b + move.j;
                    let unusedIndex = unusedCoords.findIndex(c=>c.i===aNew && c.j ===bNew);
                    if (unusedIndex >= 0 && aNew >= 0 && aNew < numRows && bNew >= 0 && bNew < numCols) {
                        let val = lines[aNew][bNew];
                        if (val === char) {
                            coords.push({i:aNew,j:bNew,round:m+1});
                            unusedCoords.splice(unusedIndex, 1)
                            numFound++;
                        }
                    }
                }
            }
            if (numFound===0) {
                break;
            }
            m++;
        }
        regions.push({char,coords});
        if (unusedCoords.length ===0) {
            break
        }
        n++;
    }
    // console.log('regions',regions);
    // now for each coor in a region, figure out how many sides in same region
    for (let k = 0; k< regions.length;k++) {
        let region = regions[k];
        let {coords} = region;
        let p = 0;
        for (let coord of coords) {
            let {i,j} = coord;
            for (let move of moves) {
                let iNew = i +move.i;
                let jNew = j +move.j;
                if (coords.filter(c=>c.i ===iNew & c.j === jNew).length === 0) {
                    p ++;
                }
            }
        }
        regions[k].p = p;
    }
    // calc total;
    let total = 0;
    for (let k = 0; k< regions.length;k++) {
        let region = regions[k];
        let {coords,p,char} = region;
        let area = coords.length;
        console.log('k,char,area,p',k,char,area,p);
        total += area*p;
    }
    console.log('total',total);
  });