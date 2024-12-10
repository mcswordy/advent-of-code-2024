const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const input = data.split('').map(n => parseInt(n));
    // console.log('input',input);
    let blocks=[];
    for (let i = 0;i<input.length;i++) {
        let item = input[i];
        let even = i%2===0;
        let itemOut = even ? Math.floor(i/2) : '.';
        console.log('i,item,itemOut',i,item,itemOut)
        for (let j = 0;j < item;j++) {
            blocks.push(itemOut);
        }
    }
    // console.log('blocks 1',blocks);
    let numB = blocks.length;
    let m =0;
    while (m < 30000) {
        let lastI = numB - (blocks.slice().reverse().findIndex(b => b!=='.')) - 1;
        let firstDot = blocks.findIndex(b=> b==='.');
        // console.log('firstDot,lastI',firstDot,blocks[firstDot],lastI,blocks[lastI]);
        if (lastI < firstDot) {
            break
        };
        [blocks[firstDot], blocks[lastI]] = [blocks[lastI], blocks[firstDot]];
        m++
    }
    console.log('m final',m);
    console.log('blocks 2',blocks);
    let checkSum = 0;
    for (let i = 0;i< blocks.length;i++) {
        b = blocks[i];
        if (b==='.') {break}
        checkSum+=parseInt(b)*i
    }
    console.log('checkSum',checkSum)
  });