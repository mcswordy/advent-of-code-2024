const fs = require("fs");
const path = "./data.txt";

fs.readFile(path, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + path);
    const lines = data.split(/\r?\n/);
    let room = [];
    let moves = [];
    let x,y;
    // parse
    for (let i=0;i<lines.length;i++) {
        line = lines[i];
        if (line[0] === '#') {
            let items = line.split('');
            room.push(items)
            let robotx = items.findIndex(item => item==='@');
            if (robotx >= 0) {
                y=i;
                x=robotx;
            }
        } else if (['v','>','^','<'].includes(line[0])) {
            moves.push(...line)
        }
    }
    let roomNew = [];
    for (let i=0;i<room.length;i++) {
        let rowNew = [];
        for (let j=0;j<room.length;j++) {
            let v = room[i][j];
            if (v ==='#') {
                rowNew.push('#');
                rowNew.push('#');
            } else if (v==='O') {
                rowNew.push('[');
                rowNew.push('');
            } else if (v==='') {
                rowNew.push('#');
                rowNew.push('#');
            } else if (v==='') {
                rowNew.push('#');
                rowNew.push('#');
            }
        If the tile is #, the new map contains ## instead.
If the tile is O, the new map contains [] instead.
If the tile is ., the new map contains .. instead.
If the tile is @, the new map contains @. instead.
    }
    let maxY = room.length;
    let maxX = room[0].length;
    let max = maxX >= maxY ? maxX : maxY;
    // console.log('max',max,maxY,maxX);
    // console.log('room',room);
    // console.log('moves',moves);
    // console.log('x,y',x,y);

    // function for looking in given dir
    let findAdjascent = ((x,y,dir) => {
        if (dir==='v') {return ([x,y+1])}
        else if (dir==='^') {return ([x,y-1])}
        else if (dir==='<') {return ([x-1,y])}
        else if (dir==='>') {return ([x+1,y])}
    })

    let printRoom = ((room) => {
        console.log('room');
        for (let row of room) {
            console.log(row.join(''))
        }
    })

    // follow moves
    for (let i=0; i< moves.length;i++) {
        let dir = moves[i];
        console.log('i,x,y',i,x,y);
        // printRoom(room)
        // console.log('dir',dir);
        // find first object in move direction
        let [ax,ay] = findAdjascent(x,y,dir);
        let av = room[ay][ax];
        // console.log('av',av);
        if (av==='.') {
            room[y][x] = '.';
            room[ay][ax] = '@';
            x = ax;
            y = ay;
            continue;
        } else if (av==='#') {
            continue;
        } else if (av==='O') {
            // see if we can find a '.' before a '#' in same direction, then move boxes too;
            let bx = ax;
            let by = ay;
            for (let j=0;j< max;j++) {
                let [cx,cy] = findAdjascent(bx,by,dir);
                let cv = room[cy][cx];
                if (cv==='#') {
                    break
                } else if (cv==='.') {
                    // can just "copy" last box rather than move all
                    // and overwrite first with robot
                    room[cy][cx] = 'O';
                    room[y][x] = '.';
                    room[ay][ax] = '@';
                    x = ax;
                    y = ay;
                    break
                } else if (cv==='O') {
                    bx = cx;
                    by = cy;
                }
            }
        }
    }
    printRoom(room);

    let total = 0;
    for (let i=0;i<maxY;i++) {
        for (let j=0;j<maxX;j++) {
            if (room[i][j]==='O') {
                total += ((100*i) + j)
            }
        } 
    }
    console.log('total',total);

    
    // let moves = lines[lines.length-1].split('');
    // .map(l=> l.split(' '));

    // console.log('res',res);
  });
