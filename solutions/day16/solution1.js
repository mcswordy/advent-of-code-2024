const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const lines = data.split(/\r?\n/);
    let numRows = lines.length;
    let numCols = lines[0].length;
    let S,E;
    let minCosts = {};
    for (let i = 0;i<numRows;i++) {
      for (let j = 0;j<numRows;j++) {
        let v= lines[i][j];
        if (v==='S') {S = {i,j}}
        if (v==='E') {E = {i,j}}
        if (v==='.' || v==='E') {
          if (minCosts[i]) {
            minCosts[i][j] = 100000000000
          } else {
            minCosts[i] = {j:100000000000}
          }
        }
      }
    }
    console.log('S,E,minCosts',S,E,minCosts)
    // 'v','>','^','<']
    let dir = '>';
    let moves = {l:1001,r:1001,s:1}
    let p = S;

    
    let getOptions = ((x,y,dir) => {
      let options = [];
      for (let [move,cost] of Object.entries(moves)) {
        if (move ==='l') {
          if (dir === '^') {options.push([y,x-1,'<',cost])}
          if (dir === 'v') {options.push([y,x+1,'>',cost])}
          if (dir === '>') {options.push([y-1,x,'^',cost])}
          if (dir === '<') {options.push([y+1,x,'v',cost])}
        } else if (move ==='r') {
          if (dir === '^') {options.push([y,x+1,'>',cost])}
          if (dir === 'v') {options.push([y,x-1,'<',cost])}
          if (dir === '>') {options.push([y+1,x,'v',cost])}
          if (dir === '<') {options.push([y-1,x,'^',cost])}
        } else if (move ==='s') {
          if (dir === '^') {options.push([y-1,x,dir,cost])}
          if (dir === 'v') {options.push([y+1,x,dir,cost])}
          if (dir === '>') {options.push([y,x+1,dir,cost])}
          if (dir === '<') {options.push([y,x-1,dir,cost])}
        }
      }
      return options;
    })

    let paths = [{id:0,n:0,p,dir,cost:0,giveUp:false,completed:false,locs:[p]}];
    let n =1;

    let id = 1;
    let minCost;
    while (n<500) {
      console.log('n',n);
      // console.log('paths',paths);
      let basePaths = paths.filter(path=>(!path.giveUp));
      let uniqueP = [];
      for (let bp of basePaths) {
        let {i,j}=bp.p;
        if (uniqueP.filter(p=>p.i===i && p.j===j).length === 0) {uniqueP.push(p)}
      }
      console.log('basePaths.len unique',basePaths.length,uniqueP.length);
      if (basePaths.length === 0) {break};
      // console.log('n,basePaths',n,basePaths);
      for (let m = 0;m< basePaths.length;m++) {
        let {id:baseId,p,dir,cost,giveUp,locs} = basePaths[m];
        let {i:y,j:x} = p;
        // console.log('x,y,dir',x,y,dir);
        let options = getOptions(x,y,dir);
        let nValidOps = 0;
        for (let op of options) {
          // console.log('op',op);
          let [oy,ox,odir,ocost] = op;
          let v = lines[oy][ox];
          let newP = {j:ox,i:oy};
          let newLocs = [...locs];
          newLocs.push(newP);
          let newCost = cost + ocost;
          if (newCost > minCost) {
            continue
          }
          let path = {id,n,p:newP,dir:odir,cost:newCost,giveUp:true,completed:true,locs:newLocs};
          // if another path already got there for less cost, forget it
          if (v==='E') {
            nValidOps+=1;
            paths.push(path);
            id++;
            if (minCost > newCost || (!minCost)) {
              minCost = newCost
            }
          } else if (v==='#') {
            continue
          } else if (v==='.') {
            // check already been there on this path, in which case avoid
            if (locs.filter(loc => loc.j===ox && loc.i===oy).length > 0) {
              continue
            } else if (newCost > minCosts[oy][ox]) {
              continue;
            } else {
              path.completed = false;
              path.giveUp = false;
              paths.push(path);
              minCosts[oy][ox] = newCost;
              id++;
              nValidOps+=1;
            }
          }
        }
        // console.log('nValidOps',nValidOps);
        paths[baseId].giveUp = true;
      }
      n++;
    }
    console.log('minCost',minCost)
    // console.log('FINAL paths',paths);
    // console.log('FINAL paths');
    // for (let fp of paths.filter(path=>path.completed)) {
    //   console.log('fp id,cost',fp.id,fp.cost)
    //   let {locs} = fp;
    //   for (let i=0;i< numRows;i++) {
    //     let row = [];
    //     for (let j=0;j<numCols;j++) {
    //       let char = locs.filter(l=>l.j===j && l.i===i).length > 0 ? '*' : lines[i][j];
    //       row.push(char)
    //     }
    //     console.log(row.join(''))
    //   }
    // }
  });
