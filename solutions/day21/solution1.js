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
        return t;
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


    let total = 0;
    // iterate over codes
    for (let code of codes) {
        console.log('code',code);
        let n1 = [3,2,'A']
        let d1 =[0,2,'A'];
        let d2 =[0,2,'A'];
        let n = 0;

        let solutions = [];
        // randomly choose path 1 or 2 each n to find all routes!
        while (n<50) {
            console.log('n',n);
            
            let pads = [[...n1],[...d1],[...d2]];
            let input = []
            console.log('start input',input.join(''))
            console.log('start npad',pads[0])
            console.log('start dpad',pads[1])
            // iterate over characters in code
            for (let c of code) {
                console.log('c',c);
                let [nPaths,n1i,n1j] = getValidPaths(pads[0],c,numKeyPad);
                let nPath = nPaths[0];
                if (nPaths[1] && Math.random() > 0.5) {nPath = nPaths[1]}
                for (let nPathMove of nPath) {
                    let [d1Paths,d1i,d1j] = getValidPaths(pads[1],nPathMove,dirKeyPad);
                    let d1Path = d1Paths[0];
                    if (d1Paths[1] && Math.random() > 0.5) {d1Path = d1Paths[1]}
                    for (let d1PathMove of d1Path) {
                        let [d2Paths,d2i,d2j] = getValidPaths(pads[2],d1PathMove,dirKeyPad);
                        let d2Path = d2Paths[0];
                        if (d2Paths[1] && Math.random() > 0.5) {d2Path = d2Paths[1]}
                        input.push(...d2Path);
                        pads[2]=[d2i,d2j,nPathMove]
                        if (d1PathMove==='A') {
                            pads[1]=[d1i,d1j,nPathMove]
                            if (nPathMove==='A') {
                                pads[0] = [n1i,n1j,c]
                            }
                        }
                    }
                }
            }
            console.log('end input',input.join(''))
            console.log('end npad',pads[0])
            console.log('end dpad',pads[1])
            solutions.push({pads,input});
            n++;
        }

        let minSolLen = Math.min(...solutions.map(s=>s.input.length));
        console.log('minSolLen',minSolLen);
        let codeNum = code.slice(0,code.length-1).join('');
        console.log('codeNum',codeNum);
        total += (minSolLen * codeNum);
    }   

    console.log('total',total);

});
