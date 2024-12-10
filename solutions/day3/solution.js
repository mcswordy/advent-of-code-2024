const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    console.log(data);
    // const muls = [...data.matchAll(/mul\(\d+\,\d+\)/g)];
    const results = [...data.matchAll(/mul\(\d+\,\d+\)|do\(\)|don't\(\)/g)];
    let total = 0;
    let _do = true;
    for (let result of results) {
        let res = result[0];
        if (res === 'do()') {
            _do = true
            continue
        } else if (res === `don't()`) {
            _do = false;
            continue
        } else if (_do) {
            let calcStrings = res.split(/[(),]/)
            let a = parseInt(calcStrings[1])
            let b = parseInt(calcStrings[2])
            total += (a*b)
        }
    }
    console.log('total',total)
  });