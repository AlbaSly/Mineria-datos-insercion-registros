/**
 * Clase de Utilidades referente a los Arrays
 */
export class ArraysUtils {
    /**
     * Método que divide un arreglo en una matriz menor dimensión de manera dinámica
     * @param array El array a dividir
     * @param chunkSize El tamaño del array reducido
     * @returns Array que contiene los arrays reducidos
     */
    static sliceIntoChunks<T>(array: Array<T>, chunkSize: number): Array<Array<T>> {
        const res: Array<Array<T>> = [];

        for (let x = 0; x < array.length; x += chunkSize) {
            const chunk = array.slice(x, x + chunkSize);
            res.push(chunk);
        }
        return res;
    }

    /**
     * Obtiene, de forma aleatoria, un objeto dentro del array proporcionado
     * @param array El array del que se obtendrá el objeto
     * @returns El objeto obtenido de forma aleatoria
     */
    static getRandomValue<T>(array: Array<T>): T {
        const randomArrayIndex: number = Math.floor(Math.random()*array.length);

        return array[randomArrayIndex];
    }

    /**
     * Afirma si existe un elemento dentro de la matriz
     * @param matrix la matriz de donde se buscará el objeto
     * @param callback la condiciones para determinar la búsqueda
     * @returns Booleano confirmando con un true que existe el elemento
     */
    static existItemInMatrix<T>(matrix: Array<Array<T>>, callback: MatrixCallback<T>): boolean {
        for (let x = 0; x < matrix.length; x++) {
            for (let y = 0; y < matrix[x].length; y++) {
                let item: T = matrix[x][y];

                if (callback(item, x, y, matrix)) return true;
            }
        }

        return false;
    }

    /**
     * Genera un arreglo con los elementos que coincidan con la condición proporcionada dentro de la matriz
     * @param matrix la matriz de la que se hará el filtro
     * @param callback las condiciones del filtro
     * @returns Arreglo con los elementos
     */
    static filterMatrixInOneArray<T>(matrix: Array<Array<T>>, callback: MatrixCallback<T>): Array<T> {
        const filtered: Array<T> = [];

        for (let x = 0; x < matrix.length; x++) {
            for (let y = 0; y < matrix[x].length; y++) {
                let item: T = matrix[x][y];

                if (callback(item, x, y, matrix)) filtered.push(item);
            }
        }

        return filtered;
    }
}

type MatrixCallback<T> = (value: T, row: number, col: number, matrix: T[][]) => boolean;