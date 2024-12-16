const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const lines = data.split(/\r?\n/);
    let numRows = lines.length;
    let numCols = lines[0].length;
    let S,E;
    let minCosts = [];
    let dirs = ['v','>','^','<']
    // let defaults = {'v':100000000000,'>':100000000000,'^':100000000000,'<':100000000000}
    // console.log('defaults',defaults);
    for (let i = 0;i<numRows;i++) {
      minCosts.push([]);
      for (let j = 0;j<numRows;j++) {
        minCosts[i].push([])
        let v= lines[i][j];
        if (v==='S') {S = {i,j}}
        if (v==='E') {E = {i,j}}
        for (let k =0;k < 4;k++) {
          minCosts[i][j].push(100000000000)
        }
      }
    }
    // console.log('S,E,minCosts',S,E,minCosts)
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
      console.log('basePaths.len',basePaths.length);
      if (basePaths.length === 0) {break};
      // console.log('n,basePaths',n,basePaths);
      for (let m = 0;m< basePaths.length;m++) {
        let {id:baseId,p,dir,cost,locs} = basePaths[m];
        let {i:y,j:x} = p;
        // console.log('x,y,dir',x,y,dir);
        let options = getOptions(x,y,dir);
        let nValidOps = 0;
        for (let op of options) {
          // console.log('op',op);
          let [oy,ox,odir,ocost] = op;
          let dirNum = dirs.indexOf(odir);
          // console.log('dirNum',dirNum);
          let v = lines[oy][ox];
          let newP = {j:ox,i:oy};
          let newLocs = [...locs];
          newLocs.push(newP);
          let newCost = cost + ocost;
          if (newCost > minCost) {continue}
          let path = {id,n,p:newP,dir:odir,cost:newCost,giveUp:true,completed:true,locs:newLocs};
          let minCostsCopy = {...minCosts};
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
            // if already got here for less (same dir), give up
            } else if (newCost > minCostsCopy[oy][ox][dirNum]) {
              // console.log('minCostsCopy[oy][ox][dirNum]',minCostsCopy[oy][ox][dirNum]);
              continue;
            } else {
              path.completed = false;
              path.giveUp = false;
              paths.push(path);
              minCosts[oy][ox][dirNum] = newCost;
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
    console.log('minCosts',minCosts);
    console.log('minCost',minCost);
    let seats = [];
    for (let wp of paths.filter(p=>p.completed && p.cost ===minCost)) {
      let {locs} = wp;
      for (let p of locs) {
        let {i,j} = p;
        if (seats.filter(s=>s.i===i && s.j===j).length === 0) {seats.push(p)}
      }
    }
    console.log('seats len',seats.length)
    // console.log('FINAL paths',paths);
    // console.log('FINAL paths');
    // for (let fp of paths.filter(path=>path.completed && path.cost ===minCost)) {
    //   console.log('fp id,cost',fp.id,fp.cost)
    //   let {locs} = fp;
    //   for (let i=0;i< numRows;i++) {
    //     let row = [];
    //     for (let j=0;j<numCols;j++) {
    //       let char = locs.filter(l=>l.j===j && l.i===i).length > 0 ? 'O' : lines[i][j];
    //       row.push(char)
    //     }
    //     console.log(row.join(''))
    //   }
    // }
  });
