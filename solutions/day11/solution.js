const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    let line = data.split(' ').map(i =>parseInt(i));
    // function
    let blink = (val) => {
        let valStr = '' + val;
        let numDigits = valStr.length;
        if (val === 0) {
            return([1]);
        } else if (numDigits % 2 === 0) {
            let half = numDigits/2;
            let l = parseInt(valStr.substring(0,half));
            let r = parseInt(valStr.substring(half,valStr.length+1));
            return([l,r]);
        } else {
            return([val*2024]);
        }
    }
    let mapping = {};
    // find mappings
    let n = 0;
    let lastStones = [...line];
    while (n < 100) {
        // console.log('n',n,lastStones);
        let lastStonesTemp = [];
        let numNew = 0;
        for (let stone of lastStones) {
            if (!(mapping[stone])) {
                let newStones = blink(stone);
                mapping[stone] = newStones;
                numNew +=1;
                for (let newStone of newStones) {
                    if (!(mapping[newStone])) {
                        lastStonesTemp.push(newStone);
                    }
                }
            };
        };
        // console.log('n end,mapping len',n,Object.keys(mapping).length);
        if (numNew === 0) {
            break;
        }
        lastStones = [...lastStonesTemp];
        n++;
    };
    // console.log('mapping',mapping);
    console.log('n',n);

    let stones = {};
    for (let l of line) {
        if (!(stones[l])) {
            stones[l] = 1
        } else {
            stones[l]++
        }
    }
    for (let i = 0; i < 75;i++) {
        let stonesCopy = {...stones};
        let res = {};
        console.log('i,stonesCopy',i,stonesCopy);
        for (let [stone,num] of Object.entries(stonesCopy)) {
            // console.log('stone,num',stone,num);
            let newStones = mapping[stone];
            // console.log('newStones',newStones);
            for (let newStone of newStones) {
                if (!(res[newStone])) {
                    res[newStone] = num;
                } else {
                    res[newStone] += num;
                }
            }
        }
        stones = {...res};
    }

    let total = 0;
    for (let [stone,num] of Object.entries(stones)) {
        total+=num;
    }
    console.log('total',total)

  });