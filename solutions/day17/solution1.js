const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    const lines = data.split(/\r?\n/);
    let registers = [];
    let program=[];
    for (let line of lines) {
        if (line[0]==='R') {
            registers.push(parseInt(line.substring(12,1000)))
        } else if (line[0]==='P') {
            program = line.split(' ')[1].split(',').map(i=>parseInt(i))
        }
    }
    console.log('registers',registers)
    console.log('program',program)
    let A = registers[0]
    let B = registers[1]
    let C = registers[2]

    // combo function
    let combo = ((operand) => {
        if ([0,1,2,3].includes(operand)) {return operand}
        else if (operand===4) {return A}
        else if (operand===5) {return B}
        else if (operand===6) {return C}
        else if (operand===7) {console.log('ERROR!!')}
    })

    // run program
    let output = [];
    let i = 0;
    let n = 0;
    while (i< program.length-1 && n < 100) {
        n++;
        let opcode = program[i]
        let operand = program[i+1]
        console.log('n,i,opcode,operand,output',n,i,opcode,operand,output);

        let denominator = 2**combo(operand);
        let resDivide = Math.floor(A/denominator);
        if (opcode===0) {
            A = resDivide;
        } else if (opcode===1) {
            let res = B ^ operand;
            B = res;
        } else if (opcode===2) {
            let res = combo(operand) % 8;
            B = res;
        } else if (opcode===3) {
            if (A===0) {
                continue
            } else {
                i = operand;
                continue;
            }
        } else if (opcode===4) {
            let res = B ^ C;
            B = res;
        } else if (opcode===5) {
            let res = combo(operand) % 8;
            output.push(res);
        } else if (opcode===6) {
            B = resDivide;
        } else if (opcode===7) {
            C = resDivide;
        }
        i+=2;
    }
    
    console.log('done');
    console.log('output',output.join(','));

    
  });
