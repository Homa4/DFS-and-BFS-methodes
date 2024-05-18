const undefinedGraph = (rad, numOfVertex, matrix) => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext('2d');
    const numberOfVertex = numOfVertex;
    const radius = rad;
    canvas.width = 1000;
    canvas.height = 600;
    const width = 1000;
    const height = 600;
    const arrOfVertex = [];
    const arrOfVertexDx2 = [];

    canvas.width = width;
    canvas.height = height;

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
                if (line === 0) {
                    x += dx1;
                } else if (line === 1) {
                    x += dx2;
                    arrOfVertexDx2.push({ x, y });
                } else {
                    x += dx3;
                }
            }

            y += dy;
            x = dx1;
        }
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

    function drawCircle(x, y, num, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'purple';
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(num, x, y);
    }

    function drawGraph(numberOfVertex) {
        let temp = numberOfVertex - 3;
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

    function drawArrow(x2, y2, angle) {
        const arrowSize = 12;
        const gapX = Math.cos(angle) * radius;
        const gapY = Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.moveTo(x2 - gapX, y2 - gapY);
        ctx.lineTo(x2 - arrowSize * Math.cos(angle - Math.PI / 6) - gapX, y2 - arrowSize * Math.sin(angle - Math.PI / 6) - gapY);
        ctx.lineTo(x2 - arrowSize * Math.cos(angle + Math.PI / 6) - gapX, y2 - arrowSize * Math.sin(angle + Math.PI / 6) - gapY);
        ctx.closePath();
        ctx.fill();
    }

    function drawLoopedLineWithArrow(x, y, radius, angle) {
        ctx.beginPath();
        ctx.arc(x + 7, y, radius - 10, Math.PI / 6, (Math.PI * 11) / 6);
        ctx.stroke();
        ctx.closePath();

        ctx.save();

        ctx.translate(x + 7 + Math.cos((Math.PI * 11) / 6) * (radius - 10), y + Math.sin((Math.PI * 11) / 6) * (radius - 10));

        const arrowSize = 12;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-12, -15);
        ctx.lineTo(-arrowSize * Math.cos((Math.PI * 11) / 6 + Math.PI / 6), -arrowSize * Math.sin((Math.PI * 11) / 6 + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    function drawArc(start, end, arrowDistance = 20, bendAngle = Math.PI / 8) {
        let midX = (start.x + end.x) / 2;
        let midY = (start.y + end.y) / 2;

        let distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

        let newEndX = end.x - (end.x - start.x) / distance;
        let newEndY = end.y - (end.y - start.y) / distance;

        let controlX, controlY;
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

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(controlX, controlY, newEndX, newEndY);
        ctx.stroke();

        return { newEndX, newEndY, controlX, controlY };
    }

    function drawArcArrow(start, end, arrowDistance = 10, bendAngle = Math.PI / 1) {
        const arrowSize = 15;
        const arrow = drawArc(start, end, arrowDistance, bendAngle);
        const newEndX = arrow.newEndX;
        const newEndY = arrow.newEndY;
        const controlX = arrow.controlX;
        const controlY = arrow.controlY;

        const angle = Math.atan2(newEndY - controlY, newEndX - controlX);

        ctx.save();
        ctx.translate(newEndX, newEndY);
        ctx.rotate(angle);
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowSize, arrowSize / 2);
        ctx.lineTo(-arrowSize, -arrowSize / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawStraitLine(start, end, angle) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        drawArrow(end.x, end.y, angle);
        ctx.closePath();
    }

    function drawEdgeLine(vertex1, vertex2, angle) {
        const { x: x1, y: y1 } = vertex1;
        const { x: x2, y: y2 } = vertex2;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const hasMis = chekingIfHasMis(midX);

        let drawArc = false;

        arrOfVertex.forEach((elem) => {
            if (elem.x === midX && elem.y === midY) {
                drawArc = true;
            } else if (hasMis && elem.y === midY) {
                drawArc = true;
            }
        });

        if (drawArc) {
            drawArcArrow({ x: x1, y: y1 }, { x: x2, y: y2 }, angle);
        } else {
            drawStraitLine({ x: x1, y: y1 }, { x: x2, y: y2 }, angle);
        }
    }

    function drawGraphEdges() {
        for (let i = 0; i < numberOfVertex; i++) {
            for (let j = 0; j < numberOfVertex; j++) {
                if (matrix[i][j] === 1 && i === j) {
                    const angle = Math.atan2(arrOfVertex[j].y - arrOfVertex[i].y, arrOfVertex[j].x - arrOfVertex[i].x);
                    drawLoopedLineWithArrow(arrOfVertex[j].x - (2 * radius - 10), arrOfVertex[i].y, radius, angle);
                } else if (matrix[i][j] === 1) {
                    const angle = Math.atan2(arrOfVertex[j].y - arrOfVertex[i].y, arrOfVertex[j].x - arrOfVertex[i].x);
                    drawEdgeLine(arrOfVertex[i], arrOfVertex[j], angle);
                }
            }
        }
    }

    drawGraph(numberOfVertex);
    drawGraphEdges();
    console.log(arrOfVertexDx2);
    console.log(matrix);
}

export default undefinedGraph;
