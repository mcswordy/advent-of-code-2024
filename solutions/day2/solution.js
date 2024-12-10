const fs = require("fs");
const path = "./data.csv";
var csv = require('csv-parser');
const customHeaders = [...Array(20).keys()];
let results = []; // Array to store the parsed data

fs.createReadStream(path)
  .pipe(csv({ separator:'   ',headers: customHeaders, skipLines: 0 }))
  .on('data', (data) => results.push(data)) // Push each row to the results array
  .on('end', () => {
    console.log('CSV file successfully processed');
    // console.log(results); // Log the array of objects
    let reports = [];
    for (let Fullreport of results) {
      // console.log('report',report);
      let fullSafe = false;
      let Fulllevels = Object.values(Fullreport).map(l=>parseInt(l));
      let sublevels = [Fulllevels];
      for (let i=0;i<Fulllevels.length;i++) {
        fullLevelsCopy = [...Fulllevels]
        fullLevelsCopy.splice(i,1);
        sublevels.push(fullLevelsCopy)
      }
      console.log('sublevels',sublevels);
      for (let levels of sublevels) {
        let safe = true;
        if (levels[0] === levels[1] || Math.abs(levels[0]-levels[1]) > 3) {
          safe = false
        } else if (levels.length <= 2) {
          safe = true;
          continue
        } else {
          // determine whether ascending based on first 2
          let ascending = levels[1] > levels[0];
          // loop over 3+
          for (let i=2;i< levels.length;i++) {
            let level = levels[i];
            let lastLevel = levels[i-1];
            if (level === lastLevel) {
              safe = false
              break
            } else {
              let isCorrectDirection = ascending ? level > lastLevel : level < lastLevel;
              let isCorrectDiff = Math.abs(level-lastLevel) <= 3;
              if (isCorrectDirection && isCorrectDiff) {
                safe = true;
              } else {
                safe = false
                break
              }
            }
          }
        }
        console.log('safe,levels',safe,levels)
        if (safe) {
          fullSafe = true;
          break
        }
      }
      reports.push({safe:fullSafe,levels:Fulllevels})
    }
    console.log('nsafereports',reports.filter(r=>r.safe).length);
    console.log('unsafe reports',reports.filter(a=>!a.safe).sort((a,b) => a.levels.length - b.levels.length));
    console.log('safe reports',reports.filter(a=>a.safe).sort((a,b) => a.levels.length - b.levels.length));
    console.log('results.length',results.length);
  })
  .on('error', (err) => {
    console.error('Error reading the CSV file:', err);
  });

