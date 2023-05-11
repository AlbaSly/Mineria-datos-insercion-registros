export class NumbersUtils {
    /**
     * Método que devuelve un número aleatorio entre un rango definido, y que además sea perteneciente a cierto múltiplo proporcionado
     * @param min Rango mínimo
     * @param max Rango máximo
     * @param mult Múltiplo de x 
     * @returns Número aleatorio 
     */
    static genRandomNumbBetweenRangeAndMult(min: number, max: number, mult: number) {
        /**Se obtiene la cantidad de números posibles que pueden ser generados de manera aleatoria según el múltiplo proporcionado */
        const possibleNumbersAmount: number = (max-min + mult) / mult;

        /**Genera un índice aleatorio dentro del rango de números posibles */
        const randomIndex: number = Math.floor(Math.random() * possibleNumbersAmount);

        /**Calcula el número aleatorio correspondiente al índice aleatorio generado previamente */
        const randomNumber = min + (randomIndex * mult);

        return randomNumber;
    }
}