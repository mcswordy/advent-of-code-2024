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
                x=robotx*2;
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
                rowNew.push(']');
            } else if (v==='.') {
                rowNew.push('.');
                rowNew.push('.');
            } else if (v==='@') {
                rowNew.push('@');
                rowNew.push('.');
            }
        }
        roomNew.push(rowNew);
    }
    room = roomNew;
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

    // printRoom(room)

    // follow moves
    for (let i=0; i< moves.length;i++) {
        let dir = moves[i];
        console.log('i,x,y',i,x,y);
        // printRoom(room)
        console.log('dir',dir);
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
        } else if (['[',']'].includes(av)) {
            // see if we can find a '.' before a '#' in same direction, then move boxes too;
            let bx = ax;
            let by = ay;
            let horizontal = ['<','>'].includes(dir);
            if (horizontal) {
                // console.log('horizontal');
                let boxes = [];
                for (let j=0;j< max;j++) {
                    let cx = bx;
                    let cy = by;
                    let cv = room[cy][cx];
                    if (cv==='#') {
                        break
                    } else if (cv==='.') {
                        // need to "move" all as may be moving each box a 'half' space
                        // console.log('h boxes',boxes);
                        for (let k = 0;k < boxes.length;k++) {
                            for (let p of boxes[k]) {
                                room[p[0]][p[1]] = p[2]
                            }
                        }
                        // still overwrite first with robot
                        room[ay][ax] = '@';
                        room[y][x] = '.';
                        x = ax;
                        y = ay;
                        break
                    } else if (['[',']'].includes(cv)) {
                        let [dx,dy] = findAdjascent(cx,cy,dir);
                        let [ex,ey] = findAdjascent(dx,dy,dir);
                        boxes.push([
                            [dy,dx,room[cy][cx]],
                            [ey,ex,room[dy][dx]]
                        ]);
                        bx = ex;
                        by = ey;
                    }
                }
            } else {
                // console.log('vertical');
                let box1;
                if (av==='[') {
                    box1 = [0,by,bx,bx+1]
                } else {
                    box1 = [0,by,bx-1,bx]
                }
                let boxes = [box1];
                let wall = false;
                for (let j=1;j< max;j++) {
                    let lastBoxes = boxes.filter(box=>box[0]===j-1);
                    // console.log('j,lastBoxes',j,lastBoxes);
                    let nCanMove = 0;
                    for (let box of lastBoxes) {
                        let [c1x,c1y] = findAdjascent(box[2],box[1],dir);
                        let [c2x,c2y] = findAdjascent(box[3],box[1],dir);
                        let c1v = room[c1y][c1x];
                        let c2v = room[c2y][c2x];
                        if (c1v==='#' || c2v ==='#') {
                            wall = true;
                            break
                        } else if (c1v==='.' && c2v==='.') {
                            nCanMove+=1
                            continue
                        } else if (c1v==='[' && c2v===']') {
                            boxes.push([j,c1y,c1x,c1x+1])
                        } else {
                            if (c1v===']') {
                                boxes.push([j,c1y,c1x-1,c1x])
                            }
                            if (c2v==='[') {
                                boxes.push([j,c1y,c2x,c2x+1])
                            }
                        }
                    }
                    if (wall) {break}
                    if (nCanMove === lastBoxes.length) {
                        console.log('v boxes',boxes);
                        // need to "move" all as may not align perfectly
                        for (let k = boxes.length-1;k >=0;k--) {
                            let box = boxes[k];
                            let [d1x,d1y] = findAdjascent(box[2],box[1],dir);
                            let [d2x,d2y] = findAdjascent(box[3],box[1],dir);
                            room[box[1]][box[2]] = '.';
                            room[box[1]][box[3]] = '.';
                            room[d1y][d1x] = '[';
                            room[d2y][d2x] = ']';
                        }
                        // still overwrite first with robot
                        room[ay][ax] = '@';
                        room[y][x] = '.';
                        x = ax;
                        y = ay;
                        break;
                    }
                }
            }
        }
    }
    printRoom(room);

    let total = 0;
    for (let i=0;i<maxY;i++) {
        for (let j=0;j<maxX;j++) {
            if (room[i][j]==='[') {
                total += ((100*i) + j)
            }
        } 
    }
    console.log('total',total);

  });
