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