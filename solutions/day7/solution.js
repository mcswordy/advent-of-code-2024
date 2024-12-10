const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const lines = data.split(/\r?\n/).map(l=> l.split(/[: ]/).filter(i => i).map(i=> parseInt(i)));
    // console.log('lines',lines);
    let total = 0;
    let ops = ['*','+','||'];
    let apply_ops = (a,b,op) => {
        if (op === '*') {
            return a*b
        } else if (op === '+') {
            return a+b
        }else if (op === '||') {
            return parseInt(`${a}${b}`)
        }
    }
    for (let line of lines) {
        let res = line[0];
        let calcs = [{level:1,val:line[1],ops:[]}];
        for (let i = 2; i < line.length;i++) {
            let n = line[i];
            let tCalcs = calcs.filter(c=>c.level === i-1);
            for (let tc of tCalcs) {
                for (let op of ops) {
                    let {val,ops} = tc;
                    nVal = apply_ops(val,n,op);
                    let nOps = [...ops];
                    nOps.push(op);
                    calcs.push({level:i,val:nVal,ops:nOps})
                }
            }
        }
        console.log('line,calcs',line,calcs)
        let options = calcs.filter(c => c.level === line.length-1).filter(c => c.val === res);
        if (options.length > 0) {
            total += res;
        }
    }
    console.log('total',total,lines.length);
    //2637
  });