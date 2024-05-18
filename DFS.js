let arrOfVertex = [];
let arrOfVertexDx2 = [];

const generateVertexForDFS = (rad, numOfVertex, matrix) => {
    const canvasDFS = document.querySelector("canvas#canvas-DFS");
    const ctxDFS = canvasDFS.getContext('2d');
    const radius = rad;
    const width = 1000;
    const height = 600;

    canvasDFS.width = width;
    canvasDFS.height = height;

    arrOfVertex = [];
    arrOfVertexDx2 = [];

    function drawCircle(x, y, num, radius) {
        ctxDFS.beginPath();
        ctxDFS.arc(x, y, radius, 0, Math.PI * 2);
        ctxDFS.fillStyle = 'purple';
        ctxDFS.fill();
        ctxDFS.closePath();

        ctxDFS.fillStyle = 'white';
        ctxDFS.font = 'bold 20px Arial';
        ctxDFS.textAlign = 'center';
        ctxDFS.textBaseline = 'middle';

        ctxDFS.fillText(num, x, y);
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

        for (let line = 0; line < 3; line++) {
            let currentLineCount = line === 0 ? firstL : (line === 1 ? secondL : thirdL);

            for (let i = 0; i < currentLineCount; i++) {
                arrOfVertex.push({ x, y });
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
        let tempForFun;
        if (temp % 2 === 0) {
            tempForFun = temp / 2;
            fillLinesWithVertex(tempForFun, tempForFun);
        } else {
            let second = Math.floor(temp / 2);
            let first = temp - second;
            fillLinesWithVertex(first, second);
        }
    }

    drawGraph();
}

function generateMisRange(cord) {
    const resArr = [];
    let temp = cord;
    for (let i = 0; i < 6; i++) {
        temp--;
        resArr.push(temp);
    }

    resArr.reverse();
    resArr.push(cord);
    temp = cord;

    for (let i = 0; i < 6; i++) {
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
    ctx.fillStyle = 'black'
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
    const ctx = document.querySelector("canvas#canvas-DFS").getContext('2d');
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
    const ctx = document.querySelector("canvas#canvas-DFS").getContext('2d');
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.closePath();

    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    drawArrow(ctx, end.x, end.y, angle);
}

function drawLoopedLineWithArrow(x, y, radius) {
    const ctx = document.querySelector("canvas#canvas-DFS").getContext('2d');
    const loopRadius = 20;

    ctx.beginPath();
    ctx.arc(x + loopRadius, y - loopRadius, loopRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();

    const angle = Math.PI / 4;
    drawArrow(ctx, x + loopRadius * 2, y - loopRadius * 2, angle);
}

function drawEdgeLine(start, end) {
    let hasMis = chekingIfHasMis((start.x + end.x) / 2);

    arrOfVertex.forEach((elem) => {
        if (elem.x === (start.x + end.x) / 2 && elem.y === (start.y + end.y) / 2) {
            drawCurve(start, end);
        } else if (hasMis && elem.y === (start.y + end.y) / 2) {
            drawCurve(start, end);
        } else {
            drawStraitLine(start, end);
        }
    });
}

const state = {
    visited: new Set(),
    stack: [],
    currentVertex: 0,
    initialized: false
};

const startVertex = 0; 

const dfs = (matrix, numberOfVertex) => {
    if (!state.initialized) {
        state.visited.add(startVertex);
        state.stack.push(startVertex);
        state.currentVertex = state.stack.pop();
        state.initialized = true;
    }

    const neighbors = [];

    for (let i = 0; i < matrix[state.currentVertex].length; i++) {
        if (matrix[state.currentVertex][i] === 1) { 
            neighbors.push(i);
        }
    }

    for (const neighborIndex of neighbors) {
        if (!state.visited.has(neighborIndex)) {
            drawEdgeLine(arrOfVertex[state.currentVertex], arrOfVertex[neighborIndex]);
            state.visited.add(neighborIndex);
            state.stack.push(neighborIndex);
        }
    }

    if (state.stack.length === 0) {
        alert("PRIMA VICTORIA\n DFS comleted");
        state.initialized = false; 
    } else {
        state.currentVertex = state.stack.pop();
    }
};

export { generateVertexForDFS, dfs };
