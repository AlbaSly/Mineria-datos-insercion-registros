export class DatesUtils {

    static GenRandomDateByAge(minAge: number, maxAge: number): Date {
        const currentDate: Date = new Date();
        const currentYear: number = currentDate.getFullYear();

        const randomAge: number = Math.floor(Math.random() * maxAge-minAge+1)+minAge;

        const randomBirthYear: number = currentYear - randomAge;
        const randomBirthDay: number = Math.floor(Math.random() * 30)+1;
        const randomBirthMonth: number = Math.floor(Math.random() * 12);

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