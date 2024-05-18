function generateSymmetricBinaryMatrix(size) {
    const matrix = [];
    console.log(size);
    const variant = 3318;
    const variantStr = variant.toString();
    const n1 = Number(variantStr[0]);
    const n2 = Number(variantStr[1]);
    const n3 = Number(variantStr[2]);
    const n4 = Number(variantStr[3]);

    const n = 10 + n3;
    const kof = 1 - n3 * 0.02 - n4 * 0.005 - 0.25;

    // Generate matrix
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            let elem = Math.floor(Math.random() * 2 * kof);
            matrix[i][j] = elem;
        }
    }

    console.log("matrix:", matrix);

    return matrix;
}

export default generateSymmetricBinaryMatrix;


// Example function to generate a symmetric binary matrix
// export default function generateSymmetricBinaryMatrix(size) {
//     const matrix = Array.from({ length: size }, () => Array(size).fill(0));
//     for (let i = 0; i < size; i++) {
//         for (let j = i; j < size; j++) {
//             if (i !== j) {
//                 const value = Math.random() < 0.5 ? 0 : 1;
//                 matrix[i][j] = value;
//                 matrix[j][i] = value;
//             }
//         }
//     }
//     return matrix;
// }
