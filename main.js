import undefinedGraph from './script.js';
import generateSymmetricBinaryMatrix from './matrixGenerator.js';
import { generateVertexForBFS, bfs } from './BFS.js';
import { generateVertexForDFS, dfs } from './DFS.js'

const radius = document.querySelector(".radius");
const numOfVertex = document.querySelector(".numberOfVertex");
const button = document.querySelector(".buttonUndef");
const buttonBFS = document.querySelector(".buttonBFS");
const buttonDFS = document.querySelector(".buttonDFS");


let matrix;

button.addEventListener("click", () => {
    const radiusValue = parseInt(radius.value, 10);
    const numOfVertexValue = parseInt(numOfVertex.value, 10);

    if (isNaN(radiusValue) || isNaN(numOfVertexValue)) {
        console.error("Invalid input for radius or number of vertices.");
        return;
    }

    matrix = generateSymmetricBinaryMatrix(numOfVertexValue);
    undefinedGraph(radiusValue, numOfVertexValue, matrix);
    generateVertexForBFS(radiusValue, numOfVertexValue, matrix);
    generateVertexForDFS(radiusValue, numOfVertexValue, matrix);
});

buttonBFS.addEventListener("click", () => {
    const numOfVertexValue = parseInt(numOfVertex.value, 10);

    if (matrix) {
        bfs(matrix, numOfVertexValue);
    } else {
        console.error("Matrix is not generated yet.");
    }
});

buttonDFS.addEventListener("click", () => {
    const numOfVertexValue = parseInt(numOfVertex.value, 10);

    if (matrix) {
        dfs(matrix, numOfVertexValue);
    } else {
        console.error("Matrix is not generated yet.");
    }
});