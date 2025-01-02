const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    let buyers = data.split(/\r?\n/).map(l=>parseInt(l));
    console.log('buyers',buyers);



    // functions
    let mix = (s,v) => {
        let res = s^v;
        return res;
    }

    console.log('test mix',mix(42,15));
    console.log('test mix 2',mix(1541105,3156183040));
     

    let prune = (s) => {
        let res = BigInt(s) % BigInt(16777216);
        return res;
    }

    console.log('test prune',prune(100000000))
   
    // Calculate the result of multiplying the secret number by 64.
    // Then, mix this result into the secret number.
    // Finally, prune the secret number.
    let s1 = (s) => {
        let v1 = s*BigInt(64);
        let v2 = mix(s,v1)
        let res = prune(v2)
        // console.log('s1: s,v1,v2,res',s,v1,v2,res)
        return res;
    };

    // Calculate the result of dividing the secret number by 32.
    // Round the result down to the nearest integer.
    // Then, mix this result into the secret number.
    // Finally, prune the secret number.
    let s2 = (s) => {
        let v1 = s/BigInt(32);
        let v2 = mix(s,v1)
        let res = prune(v2)
        // console.log('s2: s,v1,v2,res',s,v1,v2,res)
        return res;
    };
    
    // Calculate the result of multiplying the secret number by 2048.
    // Then, mix this result into the secret number.
    // Finally, prune the secret number.
    let s3 = (s) => {
        let v1 = s*BigInt(2048);
        let v2 = mix(s,v1);
        let res = prune(v2);
        // console.log('s3: s,v1,v2,res',s,v1,v2,res)
        return res;
    };


    let allSequences = {};
    let total = BigInt(0);
    for (let buyer of buyers) {
        let sequences = {};
        let secret = BigInt(buyer);
        let price = parseInt(secret.toString().split('').pop());
        console.log('start secret,price',secret,price);
        let changes  = [];
        for (let n = 0;n<2000;n++) {
            let newSecret = s1(secret);
            newSecret = s2(newSecret);
            newSecret = s3(newSecret);
            secret  = newSecret;
            let newPrice = parseInt(secret.toString().split('').pop());
            let change = newPrice - price;
            price = newPrice;
            changes.push(change);
            if (n>= 3) {
                let sequence = [changes[n-3],changes[n-2],changes[n-1],change];
                let sequenceId = sequence.join('|');
                if (!(sequences[sequenceId])) {
                    sequences[sequenceId] = price;
                }
            }

            // console.log('n,secret,price,change',n,secret,price,change);
        }

        for (let [sequenceId,sequencePrice] of Object.entries(sequences)) {
            if (allSequences[sequenceId]) {
                allSequences[sequenceId] += sequencePrice;
            } else {
                allSequences[sequenceId] = sequencePrice;
            } 
        }
        // console.log('buyer final sequences',buyer,sequences);
        // total+=secret;
    }
    
    let valueableSequences = Object.entries(allSequences).filter(([sequenceId,totalPrice]) => totalPrice >= 10);
    valueableSequences.sort((a,b) => 
    b[1] - a[1]
    )
    // for (let [sequenceId,sequencePrice] of ) {
    console.log('valueableSequences',valueableSequences);

});