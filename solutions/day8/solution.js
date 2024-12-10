const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const lines = data.split(/\r?\n/).map(l=> l.split(''));
    // let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    // let ids = '0123456789'.split('');
    // ids.push(...alphabet);
    // ids.push(...alphabet.map(l=>l.toUpperCase()));
    // console.log('ids',ids);
    // for(let id of ids) {

    let numRows = lines.length;
    let numCols = lines[0].length;
    let ids = {};
    for (let i=0;i< lines.length;i++) {
        let line = lines[i];
        for (let j=0;j< lines.length;j++) {
            let c = line[j];
            if (c!=='.') {
                if (ids[c]) {
                    ids[c].push({i,j})
                } else {
                    ids[c] = [{i,j}]
                }
            }
        }
    }
    // console.log('ids',ids)
    let antinodes = [];
    let uniqueAntinodeds = [];
    for (let [id,locs] of Object.entries(ids)) {
        for (let i=0;i< locs.length-1;i++) {
            let a = locs[i];
            for (let j=i+1;j< locs.length;j++) {
                let b = locs[j];
                let iDiff = b.i-a.i;
                let jDiff = b.j-a.j;
                for (let n = 0;n< 50;n++) {
                    let candidates = [{i:a.i - (n*iDiff),j:a.j - (n*jDiff)},{i:b.i + (n*iDiff),j:b.j + (n*jDiff)}];
                    for (let c of candidates) {
                        if (c.i >= 0 && c.i < numRows && c.j >= 0 && c.j < numCols) {
                            antinodes.push({id,...c})
                            if (uniqueAntinodeds.filter(an=> an.i === c.i && an.j===c.j).length === 0) {
                                uniqueAntinodeds.push(c);
                            }
                        }
                    }
                }
            }
        }
    }
    // console.log('antinodes',antinodes);
    console.log('uniqueAntinodeds.length',uniqueAntinodeds.length);
    //2637
  });