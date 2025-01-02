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


    let total = BigInt(0);
    for (let buyer of buyers) {
        let secret = BigInt(buyer);
        for (let n = 0;n<2000;n++) {
            // console.log('n,secret',n,secret);
            let newSecret = s1(secret);
            newSecret = s2(newSecret);
            newSecret = s3(newSecret);
            secret  = newSecret;
        }
        console.log('buyer final value',buyer,secret);
        total+=secret;
    }
    console.log('total',total);

});