const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const lines = data.split(/\r?\n/).map(l=> l.split(''));
    let numRows = lines.length;
    let numCols = lines[0].length;
    let regions = [];
    let n = 0;
    let moves = [{i:1,j:0,dir:'down'},{i:-1,j:0,dir:'up'},{i:0,j:1,dir:'right'},{i:0,j:-1,dir:'left'}];
    let unusedCoords = lines.map((l,i)=>(l.map((item,j)=>({i,j})))).flat(1);;
    console.log('unusedCoords',unusedCoords);
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
        console.log('char,nchords',char,coords.length);
        regions.push({char,coords});
        if (unusedCoords.length ===0) {
            break
        }
        n++;
    }

    // now for each coord in a region...
    for (let k = 0; k< regions.length;k++) {
        // figure out how many sides in same region
        // all other sides add to perimeter object
        let region = regions[k];
        let {coords} = region;
        let perimeters = [];
        for (let coord of coords) {
            let {i,j} = coord;
            for (let move of moves) {
                let iNew = i +move.i;
                let jNew = j +move.j;
                let {dir} = move;
                if (coords.filter(c=>c.i ===iNew & c.j === jNew).length === 0) {
                    perimeters.push({i,iNew,j,jNew,dir})
                }
            }
        }
        // now figure out if each perimeter has a neighbour on its "left"
        let numUniqueP = 0;
        for (let np=0;np<perimeters.length;np++) {
            let p = perimeters[np]
            let hasNeighbour = false;
            let {i,iNew,j,jNew,dir} = p;
            let op;
            if (['up','down'].includes(dir)) {
                op = {i,iNew,j:j-1,jNew:jNew-1};
            } else if (['left','right'].includes(dir)) {
                op = {j,jNew,i:i-1,iNew:iNew-1};
            }
            if (perimeters.filter(p2=>(p2.i===op.i && p2.j===op.j && p2.iNew ===op.iNew && p2.jNew===op.jNew)).length > 0) {
                hasNeighbour = true
            } else {
                numUniqueP++
            }
            perimeters[np].hasNeighbour = hasNeighbour;
        }
        regions[k].perimeters = perimeters;
        regions[k].p = numUniqueP;
    }

    // calc total;
    let total = 0;
    for (let k = 0; k< regions.length;k++) {
        let region = regions[k];
        let {coords,p,char,perimeters} = region;
        let area = coords.length;
        // console.log('k,char,area,p,perimeters',k,char,area,p,perimeters);
        total += area*p;
    }
    console.log('total',total);
  });
