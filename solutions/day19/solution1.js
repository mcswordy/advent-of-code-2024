const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    let lines = data.split(/\r?\n/);
    let patterns = lines[0].split(',').map(p=>p.trim());
    let designs = lines.slice(2,100000).map(l=>l.split(''));
    // console.log('patterns',patterns)
    // console.log('designs',designs)

    // function to check if patterns can make a design
    let createDesign = ((design,patterns) => {
        let solutions = patterns.filter(p=>p===design.slice(0,p.length).join('')).map(s=>[s]);
        let n = 0;
        let finishedSolutions = [];
        while (n< design.length) {
            let solutionsCopy = [...solutions];
            if (solutionsCopy.length ===0) {break}
            let solutionsN = [];
            for (let solution of solutionsCopy) {
                let designDone = solution.join('')
                let designLeft = design.slice(designDone.length,design.length);
                let newSolutions = patterns.filter(p=>p===designLeft.slice(0,p.length).join('')).map(s=>[s]);
                for (let newSolution of newSolutions) {
                    let fullSolution = [...solution];
                    fullSolution.push(...newSolution);
                    if (fullSolution.join('') === design.join('')) {
                        finishedSolutions.push(fullSolution)
                    } else {
                        solutionsN.push(fullSolution);
                    }
                }
            }
            if (finishedSolutions.length > 0) {break}
            solutions = [...solutionsN]
            n++;
        }
        return (finishedSolutions);
    })

    // first remove patterns which can be made from other patterns
    let basePatterns = [];
    for (let pattern of patterns) {
        let otherPatterns = patterns.filter(p=>p!==pattern);
        let solutions = createDesign(pattern.split(''),otherPatterns);
        if (solutions.length===0) {
            basePatterns.push(pattern)
        }
    }

    console.log('basePatterns',basePatterns);

    // Loop over designs
    let total = 0;
    let dn = 0;
    for (let design of designs) {
        console.log('dn',dn)
        let solutions = createDesign(design,basePatterns);
        // console.log('design,solns',design,solutions)
        if (solutions.length > 0) {total ++}
        dn++;
    }
    console.log('total',total);
    
});
