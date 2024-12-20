const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    let lines = data.split(/\r?\n/).map(l=>l.split(''));
    let xMax = lines[0].length;
    let yMax = lines.length;
    console.log('xMax',xMax);
    console.log('yMax',yMax);

    // parameters
    let start;
    let end;
    let walls = [];
    for (let i =0;i<yMax;i++) {
        for (let j =0;j<xMax;j++) {
            let val = lines[i][j];
            if (val==='S') {
                console.log('found S',i,j)
                start = [i,j];
            } else if (val==='E') {
                end = [i,j];
            } else if (val==='#') {
                walls.push([i,j])
            }
        }
    }
    let moves = [[1,0],[0,1],[-1,0],[0,-1]]
    console.log('start,end',start,end);
    console.log('num walls',walls.length);

    // function for looking for shortest path which avoids walls entirely in given input
    let findPaths = (grid,maxT,mustInclude) => {
        let paths = [{p:start,v:'S',m:0,locs:[start]}];
        let completePaths = [];
        let n = 1;
        while (n < maxT) {
            let pathsTemp = [...paths];
            if (pathsTemp.length ===0) {break}
            let pathsNew = []
            for (let path of pathsTemp) {
                let {p,locs} = path;
                for (let move of moves) {
                    let newP = [p[0] + move[0],p[1] + move[1]];
                    let [i,j]=newP;
                    if (i < 0 || i >= yMax || j < 0 || j >= xMax) {
                        continue
                    } else if (locs.filter(l=>l[0]===i && l[1]===j).length > 0) {
                        continue
                    } else {
                        let val = grid[i][j];
                        if (val!=='#') {
                            let newLocs = [...locs]
                            newLocs.push(newP);
                            if (val==='E') {
                                completePaths.push({p:newP,m:n,locs:newLocs})
                            } else {
                                pathsNew.push({p:newP,m:n,locs:newLocs});
                            }
                        }
                    }
                }
            }
            paths = [...pathsNew];
            n++;
        }
        let fastestComplete = Math.min(completePaths.map(p=>p.m));
        let numPaths = completePaths.length;
        return ({fastestComplete,numPaths,completePaths})
    }

    // First run with original grid to get t
    let {fastestComplete,numPaths,completePaths} = findPaths(lines,10000);
    console.log('fastestComplete',fastestComplete);
    console.log('numPaths',numPaths);
    let origPath = completePaths[0];

    // For each wall, look at possible cheats through the wall which skip part of original path
    let total = 0;
    let cheats = [];
    for (let k=0;k<walls.length;k++) {
        let wall = walls[k];
        let [i1,j1] = wall;
        let validMoves = [];
        for (let move of moves) {
            let i2 = i1 + move[0]
            let j2 = j1 + move[1]
            if (i2 >= 0 && i2 < yMax && j2 >= 0 && j2 < xMax) {
                let val = lines[i2][j2];
                if (val!=='#') {
                    let il = origPath.locs.findIndex(l=>l[0]===i2 && l[1]===j2)
                    validMoves.push([i2,j2,il])
                }
            }
        }
        validMoves.sort((a,b)=> a[2]-b[2]);
        for (let im1 = 0;im1<validMoves.length-1;im1++) {
            for (let im2 = im1+1;im2<validMoves.length;im2++) {
                let m1 = validMoves[im1]
                let m2 = validMoves[im2]
                let cheatValue = m2[2]-m1[2]-2;
                if (cheatValue>=100) {
                    cheats.push([m1,m2,m2[2]-m1[2]])
                }
            }
        }
    }
    cheats.sort((a,b)=>a[2]-b[2]);
    let uniqueCheats = [];
    for (let cheat of cheats) {
        let [i1,j1] = cheat[0]
        let [i2,j2] = cheat[1]
        if (uniqueCheats.filter(uc=>uc.i1===i1 && uc.i2===i2 && uc.j1===j1 && uc.j2===j2).length===0) {
            uniqueCheats.push(cheat);
            console.log('cheat',cheat);
            total++;
        }
    }
    console.log('total',total);

});
