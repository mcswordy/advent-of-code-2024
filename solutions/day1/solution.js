const fs = require("fs");
const path = "./data.csv";
var csv = require('csv-parser');
const customHeaders = ['left','a','b','right'];
const results = []; // Array to store the parsed data

fs.createReadStream(path)
  .pipe(csv({ separator:'   ',headers: customHeaders, skipLines: 0 }))
  .on('data', (data) => results.push(data)) // Push each row to the results array
  .on('end', () => {
    console.log('CSV file successfully processed');
    // console.log(results); // Log the array of objects
    let al = results.map(r=>parseInt(r.left)).sort();
    let ar = results.map(r=>parseInt(r.right)).sort();
    let total = 0;
    for (let i = 0;i < results.length;i++) {
        let left = al[i];
        let n = ar.filter(r => r===left).length;
        total+= (n*left);
    }

console.log('total',total);
  })
  .on('error', (err) => {
    console.error('Error reading the CSV file:', err);
  });

