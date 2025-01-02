const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);

    //parse
    let connections = data.split(/\r?\n/).map(l=>l.split('-'));
    // console.log('connections 1',connections);
    // append reverse connection for simplicity
    for (let connection of connections) {
        let [a,b] = connection;
        if (connections.filter(c=>c[0]===b && c[1]===a).length ===0) {
            connections.push([b,a])
        }
    }
    // console.log('connections 2',connections);


    let groups = [];
    // for each connection
    for (let i = 0;i<connections.length;i++) {
        let connection = connections[i];
        let [a,b] = connection;
        let otherConnections = [...connections];
        otherConnections.splice(i,1);
        // find the other connections for each of the 2 computers
        let aConns = otherConnections.filter(c=>c[0]===a).map(c=>c[1]);
        let bConns = otherConnections.filter(c=>c[0]===b).map(c=>c[1]);
        // find the common computers from those other connections
        let common = aConns.filter(v => bConns.includes(v));
        // for each in common we can make a 3-group
        for (let c of common) {
            if (a[0]==='t' || b[0]==='t' || c[0]==='t') {
                let group = [a,b,c].sort((x,y)=> x.localeCompare(y));
                let groupId = group.join(',');
                // only append if new
                if (groups.filter(g=>g===groupId).length===0) {
                    groups.push(groupId)
                }
            }
        }
    }
    console.log('groups',groups);
    console.log('groups len',groups.length);


});