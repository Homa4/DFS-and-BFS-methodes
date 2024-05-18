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
    const radiusValue = radius.value;
    const numOfVertexValue = numOfVertex.value;
    matrix = generateSymmetricBinaryMatrix(numOfVertexValue);
    undefinedGraph(radiusValue, numOfVertexValue, matrix);
    generateVertexForBFS(radiusValue, numOfVertexValue, matrix);
    generateVertexForDFS(radiusValue, numOfVertexValue, matrix);
});

buttonBFS.addEventListener("click", () => {
    const numOfVertexValue = numOfVertex.value;

    if (matrix) {
        bfs(matrix, numOfVertexValue);
    } else {
        console.error("Matrix is not generated yet.");
    }
});

buttonDFS.addEventListener("click", () => {
    const numOfVertexValue = numOfVertex.value;

    if (matrix) {
        dfs(matrix, numOfVertexValue);
    } else {
        console.error("Matrix is not generated yet.");
    }
});