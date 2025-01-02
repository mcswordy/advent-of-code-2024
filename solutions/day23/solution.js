const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    let input = data.split(/\r?\n/).map(l=>l.split('-').sort((a,b)=> a.localeCompare(b)));
    // console.log('input',input);

    // console.log('connections 1',connections);
    // append reverse connection for simplicity
    let connections = [...input];
    for (let connection of connections) {
        let [a,b] = connection;
        if (connections.filter(c=>c[0]===b && c[1]===a).length ===0) {
            connections.push([b,a])
        }
    }
    // console.log('connections 2',connections);
    let connectionsQuick = {};
    for (let connection of connections) {
        let [a,b] = connection;
        if (connectionsQuick[a]) {
            connectionsQuick[a].push(b)
        } else {
            connectionsQuick[a]= [b]
        }
    }


    // Approach is to start with only groups of 2 from the original connections
    // Then find groups of 3 from those
    // Then groups of 4 from those... etc
    let groups = [...input];
    let n = 0;
    while (n<1000) {
        let groupsCopy = [...groups];
        console.log('n,groupsCopy.length',n,groupsCopy.length);
        let newGroups = [];
        for (let i = 0;i<groupsCopy.length;i++) {
            if (i%100 ===0) {console.log('i',i)};
            let groupIn = groupsCopy[i];
            let uniqueCompOut = [];
            // look for new comps, counting for how many of the existing comps they connect
            for (let compIn of groupIn) {
                let compsOut = connectionsQuick[compIn].filter(c=>!groupIn.includes(c));
                for (let compOut of compsOut) {
                    if (uniqueCompOut[compOut]) {
                        uniqueCompOut[compOut] ++
                    } else {
                        uniqueCompOut[compOut] = 1;
                    }
                }
            }
            // console.log('uniqueCompOut',uniqueCompOut);
            let validCompOut = Object.entries(uniqueCompOut).filter(([compOut,num])=>num===groupIn.length).map(([compOut,num])=>compOut);
            // console.log('validCompOut',validCompOut);
            for (let compOut of validCompOut) {
                let newGroup = [...groupIn];
                newGroup.push(compOut);
                newGroup.sort((a,b)=> a.localeCompare(b));
                newGroup = newGroup.join(',');
                newGroups.push(newGroup);
            }
        }
        if (newGroups.length===0) {break};
        newGroups = [...new Set(newGroups)];
        newGroups = newGroups.map(ng=>ng.split(','));
        groups = newGroups;
        n++;
    }
    console.log('groups',groups.join(','));
    console.log('groups len',groups.length);


});