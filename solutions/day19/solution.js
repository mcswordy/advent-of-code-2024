const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    let lines = data.split(/\r?\n/);
    let patterns = lines[0].split(',').map(p=>p.trim());
    let designs = lines.slice(2,100000).map(l=>l.split(''));
    let maxPLen = Math.max(...patterns.map(p=>p.length))
    console.log('patterns',patterns)
    // console.log('designs',designs)
    console.log('maxPLen',maxPLen)



    // Loop over designs
    let total = 0;
    let dn = 0;
    for (let design of designs) {
        console.log('dn',dn);
        let positions = design.map(d => 0);
        // loop over every element of design (we want to know how many ways to get to up to and including this element)
        for (let i = 0;i< design.length;i++) {
            let subDesign = design.slice(0,i+1)
            // console.log('i,subDesign',i,subDesign);
            // look back up to max length of a single pattern
            for (let j = 0;j<maxPLen && i-j >= 0;j++) {
                // console.log('j',j);
                let substr = subDesign.slice(i-j).join('');
                // console.log('substr',substr);
                if (patterns.includes(substr)) {
                    // console.log('found!');
                    let val = positions[i-j-1];
                    if (i-j<=0) {val=1};
                    // console.log('val',val);
                    positions[i] += val;
                }
            }
        }
        console.log('positions',positions);
        let p = positions[design.length-1];
        console.log('p',p);
        total += p;
        dn++;
    }
    console.log('total',total);
    
});
