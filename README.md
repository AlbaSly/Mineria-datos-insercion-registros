<style>
span {
  color: #6FC276;
}
</style>

# Generador de Registros para Minería de Datos

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Descripción

API REST para la generación e inserción de registros dentro de una base de datos. 
La tecnología del lado del servidor usada es [Nest](https://github.com/nestjs/nest).

Actividad #1 de la asignatura de Minería de Datos.

## Instrucciones de la actividad

<div style="text-align:justify;">

Para la tabla **clientes**, genere <span>100,000</span> registros con nombres y apellidos aleatorios tomados de la base de datos "datos", la fecha de nacimiento será generada también de manera aleatoria, las edades de las personas no deben superar los <span>90</span> años y no debe ser menor a <span>5</span> años. En la misma tabla los campos *cve_estados* y *cve_municipios* deberán ser generados de manera aleatoria tomando como base las tablas **estados** y **municipios** de la base de datos **datos**.

Para la tabla **detalle_vuelos** genere <span>2,000</span> registros, el campo *cve_vuelos* será tomado de manera aleatoria de la tabla **vuelos** y en esta se debe generar la capacidad entre <span>350</span> a <span>500</span> (números múltiplos de <span>50</span>) asientos, así como una fecha y hora de salida, la cual debe ser cualquier día del año 2022, solo se deben considerar de la tabla vuelos los registros con el campo *cve_vuelos__origen* o con el campo *cve_vuelos__destino* sea un registro que pertenezca a algún aeropuerto del país México; la hora de salida deberá ser cualquier hora en punto.

Para la tabla **ocupaciones** el campo *cve_clientes* será aleatorio tomando como base la tabla **clientes**, pudiéndose repetir este dato, el campo *cve_detalle_vuelos* será aleatorio tomando como base la tabla **detalle_vuelos**, debe considerar que las ocupaciones (registros) no deben rebasar la capacidad  de vuelo de la tabla **detalle_vuelos**. Esta tabla debe contener al menos <span>1,000,000</span>.

_Utilice cualquier herramienta, comando SQL, o en su caso, desarrolle alguna aplicación para generar la información solicitada._

<div>

## Instalación

```bash
$ npm install
```

## Correr la aplicación

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Licencia

Nest is [MIT licensed](LICENSE).

## Generar Entidades TypeORM de la Base de Datos *airbus_380_acad*

```bash
typeorm-model-generator -h host -d airbus_380_acad -u sa -x password -e mssql -o ./src/entities/
```