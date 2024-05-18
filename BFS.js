let arrOfVertex = [];
let arrOfVertexDx2 = [];
let radius;
let ctxBFS;

const generateVertexForBFS = (rad, numOfVertex, matrix) => {
    const canvasBFS = document.querySelector("canvas#canvas-BFS");
    ctxBFS = canvasBFS.getContext('2d');
    radius = rad;
    const width = 1000;
    const height = 600;

    canvasBFS.width = width;
    canvasBFS.height = height;

    arrOfVertex = [];
    arrOfVertexDx2 = [];

    function drawCircle(x, y, num, radius, fillColor='purple', textColor='white') {
        ctxBFS.beginPath();
        ctxBFS.arc(x, y, radius, 0, Math.PI * 2);
        ctxBFS.fillStyle = fillColor;
        ctxBFS.fill();
        ctxBFS.closePath();

        ctxBFS.fillStyle = textColor;
        ctxBFS.font = 'bold 20px Arial';
        ctxBFS.textAlign = 'center';
        ctxBFS.textBaseline = 'middle';
        ctxBFS.fillText(num, x, y);
    }

    function fillLinesWithVertex(firstL, thirdL) {
        const secondL = 3;
        const dx1 = Math.floor(width / firstL) - radius;
        const dx2 = Math.floor(width / secondL);
        const dx3 = Math.floor(width / thirdL) - radius;
        const dy = Math.floor(width / (2 * firstL)) + 100;
        let x = dx1;
        let y = 50;
        let circleNumber = 1;
        let circleNumberForArr = 1;

        for (let line = 0; line < 3; line++) {
            let currentLineCount = line === 0 ? firstL : (line === 1 ? secondL : thirdL);

            for (let i = 0; i < currentLineCount; i++) {
                arrOfVertex.push({ x, y, num: circleNumberForArr++ });
                drawCircle(x, y, circleNumber++, radius);
                if (line === 1) {
                    arrOfVertexDx2.push({ x, y });
                }
                x += line === 0 ? dx1 : (line === 1 ? dx2 : dx3);
            }

            y += dy;
            x = dx1;
        }
    }

    function drawGraph() {
        let temp = numOfVertex - 3;
        if (temp % 2 === 0) {
            fillLinesWithVertex(temp / 2, temp / 2);
        } else {
            let second = Math.floor(temp / 2);
            fillLinesWithVertex(temp - second, second);
        }
    }

    drawGraph();
    console.log(arrOfVertex);
}

function paintVertex(cordinates, vertexNum, fillColor, textColor = 'white') {
    ctxBFS.beginPath();
    ctxBFS.arc(cordinates.x, cordinates.y, radius, 0, Math.PI * 2);
    ctxBFS.fillStyle = fillColor;
    ctxBFS.fill();
    ctxBFS.closePath();

    ctxBFS.fillStyle = textColor;
    ctxBFS.font = 'bold 20px Arial';
    ctxBFS.textAlign = 'center';
    ctxBFS.textBaseline = 'middle';

    ctxBFS.fillText(vertexNum, cordinates.x, cordinates.y);
}

function generateMisRange(cord) {
    const resArr = [];
    let temp = cord;
    for (let i = 0; i < radius; i++) {
        temp--;
        resArr.push(temp);
    }

    resArr.reverse();
    resArr.push(cord);
    temp = cord;

    for (let i = 0; i < radius; i++) {
        temp++;
        resArr.push(temp);
    }
    return resArr;
}

function chekingIfHasMis(cordX) {
    const arr = generateMisRange(cordX);
    return arrOfVertexDx2.some(elem => arr.includes(elem.x));
}

function drawArrow(ctx, x, y, angle) {
    const arrowSize = 12;
    ctx.fillStyle = 'black';
    ctx.save(); 
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowSize, arrowSize / 2);
    ctx.lineTo(-arrowSize, -arrowSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore(); 
}

function drawCurve(start, end) {
    const ctx = document.querySelector("canvas#canvas-BFS").getContext('2d');
    let midX = (start.x + end.x) / 2;
    let midY = (start.y + end.y) / 2;
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    let newEndX = end.x - (end.x - start.x) / distance;
    let newEndY = end.y - (end.y - start.y) / distance;
    let controlX, controlY;
    const bendAngle = Math.PI / 8;

   
    if (start.x !== end.x && start.y !== end.y) {
        controlX = midX + Math.cos(bendAngle) * (midY - start.y);
        controlY = midY + Math.sin(bendAngle) * (midX - start.x);
    } else if (start.x === end.x) {
        controlX = midX + 100;
        controlY = midY;
    } else {
        controlX = midX;
        controlY = midY + 100;
    }

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(controlX, controlY, newEndX, newEndY);
    ctx.stroke();

    const angle = Math.atan2(newEndY - controlY, newEndX - controlX);
    drawArrow(ctx, newEndX, newEndY, angle);
}

function drawStraitLine(start, end) {
    const ctx = document.querySelector("canvas#canvas-BFS").getContext('2d');
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.closePath();

    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    drawArrow(ctx, end.x, end.y, angle);
}

function drawEdgeLine(start, end) {
    let hasMis = chekingIfHasMis((start.x + end.x) / 2);
    let drawArc = false;

   
    arrOfVertex.forEach((elem) => {
        if (elem.x === (start.x + end.x) / 2 && elem.y === (start.y + end.y) / 2) {
            drawArc = true;
        } else if (hasMis && elem.y === (start.y + end.y) / 2) {
            drawArc = true;
        }
    });

    if (drawArc) {
        drawCurve(start, end); 
    } else {
        drawStraitLine(start, end); 
    }
}

const state = {
    visited: new Set(),
    queue: [],
    currentVertex: 0,
    initialized: false,
    vertexWichWillNeverBeReached: new Set(),
};

const startVertex = 0;

const bfs = (matrix, numberOfVertex) => {
    if (!state.initialized) {
        state.visited.add(startVertex); 
        state.queue.push(startVertex);
        state.currentVertex = state.queue.shift();
        state.initialized = true;
    }

    const neighbors = [];

    for (let i = 0; i < matrix[state.currentVertex].length; i++) {
        if (matrix[state.currentVertex][i] === 1) {
            neighbors.push(i);
        }
    }

    for (const neighbor of neighbors) {
        if (!state.visited.has(neighbor)) {
            state.visited.add(neighbor);
            state.queue.push(neighbor);
            paintVertex(arrOfVertex[neighbor], neighbor + 1, 'yellow'); 
            drawEdgeLine(arrOfVertex[state.currentVertex], arrOfVertex[neighbor]); 
        }
    }

    paintVertex(arrOfVertex[state.currentVertex], state.currentVertex + 1, 'red'); 

    if (state.queue.length === 0) {
        alert("BFS completed");
    } else {
        state.currentVertex = state.queue.shift(); 
    }
};

export { generateVertexForBFS, bfs };
