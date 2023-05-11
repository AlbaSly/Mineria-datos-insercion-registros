/**
 * Clase de Utilidades referente a las Fechas
 */
export class DatesUtils {

    /**
     * Método que permite generar una fecha de nacimiento respecto a la edad proporcionada
     * @param minAge Edad mínima 
     * @param maxAge Edad máxima
     * @returns Fecha generada aleatoriamente
     */
    static GenRandomDateByAge(minAge: number, maxAge: number): Date {
        /**Se obtiene la fecha actual */
        const currentDate: Date = new Date();
        /**Se obtiene el año actual */
        const currentYear: number = currentDate.getFullYear();

        /**Se obtiene un número aleatorio entre el rango de edades proporcionada */
        const randomAge: number = Math.floor(Math.random() * maxAge-minAge+1)+minAge;

        /**Se obtiene la resta entre el año actual y la edad generada aleatoriamente */
        const randomBirthYear: number = currentYear - randomAge;
        /**Se obtiene un número aleatorio entre los días */
        const randomBirthDay: number = Math.floor(Math.random() * 30)+1;
        /**Se obtiene un número aleatorio */
        const randomBirthMonth: number = Math.floor(Math.random() * 12);

        /**Se construye la nueva fecha con los datos obtenidos de forma aleatoria previamente */
        const birthDate: Date  = new Date(randomBirthYear, randomBirthMonth, randomBirthDay);

        return birthDate;
    }

    /**
     * Método que permite generar una fecha aleatoria de cierto año proporcionado
     * @param year El año del que se obtendrá la fecha aleatoria
     * @returns La fecha generada con hora en punto.
     */
    static GenRandomDateByYear(year: number): Date {
        /**Tiempo en milisegundos para la fecha de inicio desde el 1ro de Enero de x=year */
        const startDate: number = new Date(year, 0, 1).getTime();
        /**Tiepoem milisegundos para la última fecha del año (31 de diciembre de x=year) */
        const endDate: number = new Date(year, 11, 31).getTime();
        /**Se genera de forma aleatoria el timestamp en milisegundos sobre un valor entre los milisegundos obtenidos de ambas fechas */
        const randomTimestamp: number = startDate + Math.random()*(endDate-startDate);
        /**Construir la fecha con el timestamp generado previamente */
        const randomDate: Date = new Date(randomTimestamp);
        randomDate.setMinutes(0); //Establecer los minutos a cero
        randomDate.setSeconds(0); //Establecer los segundos a cero

        return randomDate;
    }
}