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
    // console.log('registers',registers)
    console.log('program',program.join(','))
    let A = registers[0]
    let B = registers[1]
    let C = registers[2]
    let programString = program.join(',')

    // combo function
    let combo = ((operand) => {
        if ([0,1,2,3].includes(operand)) {return operand}
        else if (operand===4) {return A}
        else if (operand===5) {return B}
        else if (operand===6) {return C}
        else if (operand===7) {console.log('ERROR!!')}
    })

    // let start = 8**15;
    // let end = 8**16;
    // console.log('e-s',end-start)
    // let m = start;

    // let target = [0,3,1,4,5,5,3,0]
    // let target = [2,4,1,1,7,5,4,6]
    let target = [program]
    let targetString = target.join(',')

    // 12098084 * 6826538
    let start = 12098084 * 6826538;
    // let start = 1;
    let m = start;
    // let interesting = [];
    while (m<= start + 3) {
        if (m % 10000000 === 0) {console.log('m',m)}
        // run program
        let output = [];
        let i = 0;
        let n = 0;
        // A = 8**m;
        A = m;
        B=0;
        C=0;
        // console.log('m',m,A);
        let fail = false;
        let wrongOut;
        let steps = [];
        while (i< program.length-1 && n < 200) {
            n++;
            let opcode = program[i]
            let operand = program[i+1]
            // console.log('i:',i,'A:',A,'B:',B,'C:',C,'oc:',opcode,'op:',operand);//,'out:'output.join(',')
            steps.push({n,A,B,C,i,output})
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
                    // console.log('A is 0, we are done!')
                } else {
                    if (operand===i) {
                        console.log('stuck!')
                        break
                    } else {
                        i = operand;
                        continue;
                    }
                }
            } else if (opcode===4) {
                let res = B ^ C;
                B = res;
            } else if (opcode===5) {
                let res = combo(operand) % 8;
                // console.log('out:',res);
                // output.push(res);
                if (res === target[output.length]) {
                    output.push(res);
                } else {
                    wrongOut = res;
                    fail = true;
                }
            } else if (opcode===6) {
                B = resDivide;
            } else if (opcode===7) {
                C = resDivide;
            }
            if (fail) {break}
            i+=2;
        }
        // if (output.length > 7) {console.log('m,i,out',m,i,output.join(','))}
        if (output.length >= 0) {
            // interesting.push({m,output})
            console.log('m',m,'A',A,'L',output.length,'output',output.join(','),'wrongOut',wrongOut);
            for (let step of steps) {
                console.log('n',step.n,'i',step.i,'A',step.A,'B',step.B,'C',step.C,'out',step.output.join(','))
            }
        }
        if (output.join(',') === targetString) {break};
        m++;
    }
    console.log('m final',m)

    
  });

//   2,4
//   1,1
//   7,5
//   4,6
//   0,3
//   1,4
//   5,5
//   3,0



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
    let programString = program.join(',')

    // combo function
    let combo = ((operand) => {
        if ([0,1,2,3].includes(operand)) {return operand}
        else if (operand===4) {return A}
        else if (operand===5) {return B}
        else if (operand===6) {return C}
        else if (operand===7) {console.log('ERROR!!')}
    })

    let A = 0;
    let B = 0;
    let C = 0;
    
    // console.log('m',m)
    if (m % 10000000 === 0) {console.log('m',m)}
    // run program
    let output = [];
    let i = 0;
    let n = 0;
    A = m;
    let fail = false;
    let pBack = [{oc:5,op:5}]
  2,4
  1,1
  7,5
  4,6
  0,3
  1,4
  5,5
  3,0
    for (let i = 0;i< program.length;i++) {
        let out = program[program.length - i]
        console.log('out',out)
        for (let p = 0;p<7;p++) {
            if (p===0) {//5,5
                // B % 8 needs to be equal to ith element from wend of p
                console.log('B%8, out',B%8)
            } else if (p===1) {//1,4
                B = B ^ 4
            } else if (p===2) {//0,3
                A = A * (2**3)
            } else if (p===3) {//4,6
                B= B ^ C
            } else if (p===4) {//7,5
                
            } else if (p===5) {//1,1
                B = B ^ 1
            } else if (p===6) {//2,4
                
            }
        }
    }
    p < 7;
    while (i< 5 && n < 100) {
        n++;
        let opcode = program[i]
        let operand = program[i+1]
        console.log('i:',i,'A:',A,'B:',B,'C:',C,'oc:',opcode,'op:',operand);//,'out:'output.join(',')

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
                console.log('A is 0, we are done!')
            } else {
                if (operand===i) {
                    // console.log('stuck!')
                    break
                } else {
                    i = operand;
                    continue;
                }
            }
        } else if (opcode===4) {
            let res = B ^ C;
            B = res;
        } else if (opcode===5) {
            let res = combo(operand) % 8;
            console.log('out:',res);
            if (res === program[output.length]) {
                output.push(res);
            } else {
                fail = true;
            }
        } else if (opcode===7) {
            C = resDivide;
        }
        if (fail) {
            break
        }
        i+=2;
    }
    
  });

