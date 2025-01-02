const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    let input = data.split(/\r?\n/);
    let wires = {};
    let gates = [];
    for (let line of input) {
        if (line.includes(':')) {
            let split = line.split(': ');
            wires[split[0]] = parseInt(split[1])
        } else if (line.includes(' ')) {
            let split = line.split(' ');
            let [w1,logic,w2,_,wOut] = split;
            gates.push([w1,w2,logic,wOut])
        }
    }
    console.log('wires',wires);
    console.log('gates',gates);

    // functions
    let doGate = (w1,w2,logic) => {
        let res;
        if (logic === 'AND') {
           res = w1 === 1 && w2===1 ? 1 : 0;
        } else if (logic ==='OR') {
            res = w1 === 1 || w2===1 ? 1 : 0;
        } else if (logic ==='XOR') {
            res = w1 !== w2 ? 1 : 0;
        }
        console.log('w1,w2,logic,res',w1,w2,logic,res);
        return res;
    }

    let is0or1 = (n) => {
        return n===0 || n===1
    }

    // find first unexecuted gate in list where both inputs available
    let gatesToRun = [...gates];
    for (let n = 0;n < gates.length;n++) {
        console.log('n',n);
        let eligibleGateIndex = [...gatesToRun].findIndex(g => is0or1(wires[g[0]]) && is0or1(wires[g[1]]));
        console.log('eg index',eligibleGateIndex);
        if (eligibleGateIndex < 0) {break}
        let gate = gatesToRun[eligibleGateIndex];
        let [w1,w2,logic,wOut] = gate;
        let w1v = wires[w1];
        let w2v = wires[w2];
        let res = doGate(w1v,w2v,logic);
        wires[wOut] = res;
        gatesToRun.splice(eligibleGateIndex,1)
    }
    console.log('wires',wires);
    
    // loop over z wires
    let binNums = [];
    for (let [wire,val] of Object.entries(wires)) {
        if (wire.split('')[0]==='z') {
            binNums.push({wire,val});
        }
    }
    binNums.sort((a,b)=> b.wire.localeCompare(a.wire));
    console.log('binNums',binNums);
    let binNum = binNums.map(n=>n.val);
    console.log('binNum',binNum);
    let decNum = parseInt(binNum.join(''),2);
    console.log('decNum',decNum);

});