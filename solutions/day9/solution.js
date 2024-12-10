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
        blocks.push({val:itemOut,num:item});
    };
    console.log('blocks 1',blocks);
    console.log(blocks.filter(b=>b.val ===145))
    for (let id = Math.floor((input.length)/2);id>=0;id--) {
        let i = blocks.length - (blocks.slice().reverse().findIndex(b => b.val===id))-1;
        let numReq = blocks[i].num;
        let j = blocks.findIndex(b => b.val==='.' && b.num >=numReq);
        let numTar = blocks[j].num;
        if (j > 0 && j < i) {
            blocks[i].val='.';
            blocks[j].val=id;
            if (numTar > numReq) {
                let diff = numTar - numReq;
                blocks[j].num = numReq;
                blocks.splice(j+1, 0, {val:'.',num:diff});
            }
        }
    }
    console.log('blocks 2',blocks);
    let checkSum = 0;
    let n = 0;
    for (let i = 0;i< blocks.length;i++) {
        b = blocks[i];
        for (let j = 0;j<b.num;j++) {
            checkSum+= b.val==='.' ? 0 : parseInt(b.val)*n
            n++
        }
        
    }
    console.log('checkSum',checkSum)
  });