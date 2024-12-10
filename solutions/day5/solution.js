const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    // console.log(data);
    const lines = data.split(/\r?\n/);
    let rules = lines.filter(l=>l.includes('|')).map(l=>(l.split('|').map(n=>parseInt(n))));
    let updates = lines.filter(l=>l.includes(',')).map(l=>(l.split(',').map(n=>parseInt(n))));
    // console.log('rules',rules);
    // console.log('updates',updates);
    let total = 0;
    for (let update of updates) {
      let uRules = rules.filter(r =>(update.includes(r[0]) && update.includes(r[1])));
      if (uRules.length > 0) {
        let violation = false;
        for (let i=0;i< update.length-1;i++) {
          for (let j=i+1;j < update.length;j++) {
            let l = update[i]
            let r = update[j]
            let rule = uRules.find(rule => rule[0]===r && rule[1] ===l);
            if (rule) {
              console.log('rule violated',rule,update,i,j)
              violation = true;
              break
            }
          }
          if (violation) {break}
        }
        if (violation) {
          console.log('violation',update,uRules);
          while (true) {
            let nChanges = 0;
            for (let i=0;i< update.length-1;i++) {
              for (let j=i+1;j < update.length;j++) {
                let l = update[i]
                let r = update[j]
                let rule = uRules.find(rule => rule[0]===r && rule[1] ===l);
                if (rule) {
                  nChanges+=1;
                  [update[i], update[j]] = [update[j], update[i]];
                }
              }
            }
            console.log('nChanges',nChanges,update)
            if (nChanges===0) {
              break
            }
          }
          let m = Math.floor((update.length-1)/2);
          let val = update[m];
          total += val;
        }
      }
    }
    console.log('total',total);
  });