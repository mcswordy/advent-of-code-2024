const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    let codes = data.split(/\r?\n/).map(l=>l.split(''));

    // parameters
    // let moves = [[1,0,'v'],[0,1,'>'],[-1,0,'^'],[0,-1,'<']];
    let moves = {'v':[1,0],'>':[0,1],'^':[-1,0],'<':[0,-1]}

    let dirKeyPad = [
        ['X','^','A'],
        ['<','v','>']
    ]
    let numKeyPad = [
        ['7','8','9'],
        ['4','5','6'],
        ['1','2','3'],
        ['X','0','A'],
    ]

    // functions
    let getPos = (c,keyPad) => {
        for (let i=0;i<keyPad.length;i++) {
            for (let j=0;j<keyPad[0].length;j++) {
                if (keyPad[i][j]===c) {return [i,j]}
            }
        }
    }

    let getValidPaths = (sPos,eChar,keyPad) => {
        // console.log('sPos',sPos,'eChar',eChar);
        // determine 2 possible paths from current position to s to e
        let [si,sj] = sPos;
        let [ti,tj]= getPos(eChar,keyPad);
        if (si===ti && sj===tj) {
            return [['A'],ti,tj]
        }
        // console.log('si,sj',si,sj)
        // console.log('ti,tj',ti,tj)
        let di = ti - si;
        let dj = tj - sj;
        let iDir = di < 0 ? '^' : 'v';
        let jDir = dj < 0 ? '<' : '>';
        let nPaths = [];
        if (di!==0) {
            let path1 = [...Array(Math.abs(di))].map(_ => iDir);
            let path2 = [...Array(Math.abs(dj))].map(_ => jDir);
            path1.push(...path2)
            nPaths.push(path1)
        }
        if (dj!==0) {
            let path1 = [...Array(Math.abs(dj)).keys()].map(_ => jDir);
            let path2 = [...Array(Math.abs(di)).keys()].map(_ => iDir);
            path1.push(...path2)
            nPaths.push(path1)
        }
        let validPaths = [];
        // try each path and if it avoids X then it's ok
        for (let path of nPaths) {
            let valid = true;
            let [i,j] = sPos;
            for (let n = 0;n<path.length;n++) {
                i += moves[path[n]][0]
                j += moves[path[n]][1]
                let v = keyPad[i][j];
                if (v==='X') {valid = false}
            }
            if (valid) {
                path.push('A');
                validPaths.push(path)
            ;}
        }
        // console.log('validPaths',validPaths);
        return [validPaths,ti,tj]
    }

    let choosePath = (paths)=> {
        let path = paths[0];
        if (paths[1] && Math.random() > 0.5) {path = paths[1]}
        return path
    }

    let totalPads = 27;
    let total = 0;
    // iterate over codes
    for (let code of codes) {
        console.log('code',code);
        let n = 0;
        let solutions = [];
        // randomly choose path 1 or 2 each n to find all routes!
        while (n<1) {
            // console.log('n',n);
            let codeCopy = [...code];
            let nPadCopy = [3,2,'A',codeCopy,[]];// i,j,current val, targets (path), actual moves made
            let pads = [nPadCopy];
            for (let dc = 0;dc<totalPads-1;dc++) {
                let dInit =[0,2,'A',[],[]];
                pads.push([...dInit])
            }
            let input = [];
            let m = 1;
            let t = 1;
            let dir = 'down';
            // console.log('startpads',pads);
            // go down chain of robots finding next right move (based on target of previous robot)
            // all the way back to me (input) where I input the full sequence required for the last robot's next move
            // then go back through "A"s updating positions, until you hit a non-A, then back down again
            // repeat until you are back at 0
            // Pad m refers to the pad being operated on
            while (t< 100000000 && m >= 0) {
                // console.log(' ');
                // console.log('t',t,'m',m,'dir',dir,'input',input.join(''));
                // console.log('m',m,'dir',dir);
                // console.log('pads',pads);
                if (dir==='down') {
                    let source = pads[m-1].slice(0,2);// take first in list of remaining targets
                    let target = pads[m-1][3][0];// take first in list of remaining targets
                    let keyPad = m === 1 ? numKeyPad : dirKeyPad;// 2nd robot trying to get 1st robot to use numkeypad
                    let [paths] = getValidPaths(source,target,keyPad);
                    let path = choosePath(paths);
                    pads[m][3]=[...path];
                    if (m===totalPads-1) {
                        dir='up';
                        input.push(...path);
                        m--;
                    } else {
                        m++;
                    }
                } else if (dir==='up') {
                    // We have just clicked A on previous Robot!
                    // So move 1 along path
                    let [i,j,p,path] = pads[m];
                    path = [...path];
                    let vNew = path[0];
                    pads[m][2] = vNew;
                    pads[m][3].shift(); // clear down first entry in path
                    pads[m][4].push(vNew);
                    let keyPad = m === 0 ? numKeyPad : dirKeyPad;// 2nd robot trying to get 1st robot to use numkeypad
                    // console.log('vNew',vNew);
                    posNew = getPos(vNew,keyPad);
                    // console.log('posNew',posNew);
                    pads[m][0] = posNew[0];
                    pads[m][1] = posNew[1];
                    if (path.length ===1) {
                        // if we are at A we at the end of the path and simply pressing enter
                        // move back up the robots!
                        m--;
                    } else {
                        dir='down';
                        m++;
                    }
                }
                t++
            }
            
            console.log('t final',t);
            // console.log('n,input',n,input.join(''));
            solutions.push({pads,input});
            n++;
        }

        console.log('code',code);
        let minSolLen = Math.min(...solutions.map(s=>s.input.length));
        console.log('minSolLen',minSolLen);
        let codeNum = code.slice(0,code.length-1).join('');
        console.log('codeNum',codeNum);
        let codeResult = minSolLen * codeNum;
        console.log('code result',codeResult)
        total += codeResult;

    }   

    console.log('total',total);

});

// <vA<AA>>^AvAA<^A>Av<<A>>^AvA^Av<<A>>^AAvA<A^>A<A>Av<<A>A^>AAAvA^<A>A
// <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A