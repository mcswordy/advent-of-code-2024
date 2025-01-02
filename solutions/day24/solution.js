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
            wires[split[0]] = {v:parseInt(split[1])}
        } else if (line.includes(' ')) {
            let split = line.split(' ');
            let [w1,logic,w2,_,wOut] = split;
            gates.push([w1,w2,logic,wOut]);
            if (!wires[wOut]) {wires[wOut] = {}};
        }
    }
    // console.log('wires',wires);
    // console.log('gates',gates);

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
        return res;
    }

    let is0or1 = (n) => {
        return n===0 || n===1
    }

    let getDecNum = (char) => {
        let binNums = [];
        for (let [wire,val] of Object.entries(wires)) {
            if (wire.split('')[0]===char) {
                binNums.push({wire,val:val.v});
            }
        }
        binNums.sort((a,b)=> b.wire.localeCompare(a.wire));
        let binNum = binNums.map(n=>n.val);
        let decNum = parseInt(binNum.join(''),2);
        return decNum
    }

    let runGates = (gatesIn,wiresIn) => {
        let wiresOut = {...wiresIn};
        let gatesToRun = [...gatesIn];
        for (let n = 0;n < gatesIn.length;n++) {
            let eligibleGateIndex = [...gatesToRun].findIndex(g => is0or1(wiresOut[g[0]].v) && is0or1(wiresOut[g[1]].v));
            if (eligibleGateIndex < 0) {break}
            let gate = gatesToRun[eligibleGateIndex];
            let [w1,w2,logic,wOut] = gate;
            let w1v = wiresOut[w1].v;
            let w2v = wiresOut[w2].v;
            let res = doGate(w1v,w2v,logic);
            wiresOut[wOut].v = res;
            gatesToRun.splice(eligibleGateIndex,1);
        };
        let zBins = Object.entries(wiresOut).filter(([key,_])=> key[0]==='z');
        return zBins;
    }


    // find target Z (sum of x & y)
    let xDec = getDecNum('x');
    let yDec = getDecNum('y');
    let zDec = xDec+yDec;
    let zBinary = Number(zDec).toString(2);
    // console.log('zBinary',zBinary);
    // console.log('zBinary.length',zBinary.length);
    // let numZ = Object.keys(wires).filter(k=>k[0]==='z').length;
    // console.log('numZ',numZ);

    let zWires = Object.keys(wires).filter(k=>k[0]==='z');
    zWires.sort((a,b)=> b.localeCompare(a));
    for (let i = 0;i<zWires.length;i++) {
        let zWire = zWires[i];
        wires[zWire].t = parseInt(zBinary[i]);
    }

    // console.log('wires',wires);



    // figure out which z values are wrong?
    let zBins = runGates(gates,wires);
    // console.log('wiresOut',wiresOut);
    zBins.sort((a,b)=> b[0].localeCompare(a[0]));
    let badZBins = [];
    for (let zBin of zBins) {
        let key = zBin[0];
        let {t,v} = zBin[1];
        if (t!==v) {
            badZBins.push(key);
        }
    }
    // z16-19 wrong
    // z31-36 wrong
    // z38-39 wrong
    // so let's rule out any gates which have no impact on these!

    let candidateGates = [];
    for (let badZBin of badZBins) {
        console.log('badZBin',badZBin);
        let n = 0;
        let foundGates = [...gates].filter(g=>g[3]===badZBin);
        candidateGates.push(badZBin);
        while (n< 100) {
            console.log('n',n);
            let foundGatesCopy = [...foundGates];
            if (foundGatesCopy.length ===0) {break};
            let foundGatesNew = [];
            for (let foundGate of foundGatesCopy) {
                let [w1,w2,logic,wOut] = foundGate;
                for (let gate of [w1,w2]) {
                    let newGate = [...gates].filter(g=>g[3]===gate)[0];
                    if (newGate) {
                        foundGatesNew.push(newGate);
                        candidateGates.push(gate);
                    }
                }
            }
            foundGates = [...foundGatesNew];
            n++;
        }
    }
    candidateGates = [...new Set(candidateGates)]
    console.log('candidateGates',candidateGates.length);

    // find first unexecuted gate in list where both inputs available
   
    
    // // loop over z wires

    // console.log('binNums',binNums);
    // console.log('binNum',binNum);
    // console.log('decNum',decNum);

});