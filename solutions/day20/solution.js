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
    for (let i =0;i<yMax;i++) {
        for (let j =0;j<xMax;j++) {
            let val = lines[i][j];
            if (val==='S') {
                console.log('found S',i,j)
                start = [i,j];
            }
        }
    }
    let moves = [[1,0],[0,1],[-1,0],[0,-1]]
    console.log('start',start);

    // function for looking for shortest path which avoids walls entirely in given input
    let findPaths = (grid,maxT) => {
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

    // First run with original grid
    let {fastestComplete,numPaths,completePaths} = findPaths(lines,10000);
    console.log('fastestComplete',fastestComplete);
    console.log('numPaths',numPaths);
    let origPath = completePaths[0].locs;

    // For each point on original path, look at all 1-20 move combinations...
    // ...which don't overlap with themselves
    // need to de-duplicate where another cheat path has got to same point earlier otherwise gets slooow!
    let cheats = [];
    for (let n =0;n<origPath.length;n++) {
        console.log('n',n);
        let p1 = origPath[n];
        let m = 1;
        let paths = [{p:p1,o:0,locs:[p1]}];
        while (m <= 20) {
            let pathsTemp = [...paths].filter(p=>p.o===m-1);
            if (pathsTemp.length ===0) {break}
            for (let path of pathsTemp) {
                let {p,locs} = path;
                for (let move of moves) {
                    let newP = [p[0] + move[0],p[1] + move[1]];
                    let [i,j]=newP;
                    if (i < 0 || i >= yMax || j < 0 || j >= xMax) {
                        continue
                    } else if (locs.filter(l=>l[0]===i && l[1]===j).length > 0) {
                        continue
                    } else if (paths.filter(p=>p.p[0]===i && p.p[1]===j).length > 0) {
                        continue
                    } else {
                        let val = lines[i][j];
                        let newLocs = [...locs]
                        newLocs.push(newP);
                        let newPath = {p:newP,o:m,locs:newLocs}
                        paths.push(newPath);
                        if (val!=='#') {
                            let on = origPath.findIndex(l=>l[0]===i && l[1]===j);
                            // take time up to start of cheat + time cheating
                            // that needs to be at least 100 before the original time to the point at end of cheat
                            if (n+m <= on-100) {
                                cheats.push(newPath)
                            }
                        }
                    }
                }
            }
            m++;
        }
    }
    
    console.log('# cheats',cheats.length);

});
