export class ArraysUtils {
    /**
     * Método que divide un arreglo en arreglos de menor dimensión de manera dinámica
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
}