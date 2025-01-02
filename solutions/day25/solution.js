const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    let input = data.split(/\r?\n/);
    let locks = [];
    let keys = [];
    let n = 0;
    while (n < input.length/8) {
        console.log('n',n);
        let isLock = false;
        let cols = [-1,-1,-1,-1,-1];
        let nTemp = n*8;
        for (let m = nTemp;m < nTemp+7;m++) {
            console.log('m',m);
            let line = input[m];
            console.log('line',line);
            if (m===n*8 && line === '#####') {
                isLock = true;
            }
            for (k = 0;k<5;k++) {
                console.log('k',k);
                let val = line[k];
                if (val === '#') {
                    cols[k]++
                }
            }
        }
        if (isLock) {
            locks.push(cols)
        } else {
            keys.push(cols)
        }
        n++;
    }
    

    console.log('locks',locks);
    console.log('keys',keys);

    let total = 0;
    for (let lock of locks) {
        for (let key of keys) {
            let valid = true;
            for (k = 0;k<5;k++) {
                let v1 = lock[k]
                let v2 = key[k]
                if (v1+v2 > 5) {
                    valid = false;
                    break
                }
            }
            if (valid) {
                total++
            }
        }
    }
    console.log('total',total);


});