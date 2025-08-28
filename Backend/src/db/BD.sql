-- Crear la base de datos si no existe
create database if not exists register_store;
use register_store;

-- Crear tabla personas
CREATE TABLE personas (
	id_personas INT auto_increment primary key,
    nombre varchar(100),
    apellido varchar(100),
    tipo_identificacion varchar(50),
    nuip int,
    email varchar(100),
    clave varchar(500),
    salario decimal(10,2),
    activo boolean default true,
    fecha_registro date default (current_date),
    imagen longblob
);

-- Ver los registros actuales de la tabla personas
select * from personas;


-- Crear tabla usuarios
create table usuarios (
	id_usuario int auto_increment primary key,
    nombre varchar(100),
    apellido varchar(100),
    telefono varchar(20),
    email varchar(100) unique,
    clave varchar(500),
    rol ENUM('cliente', 'admin', 'super_usuario') default 'cliente',
    fecha_registro datetime default current_timestamp
);

select * from usuarios;

-- Crear tabla productos con campo stock calculado
create table productos (
	id_producto int auto_increment primary key,
    nombre varchar(100) not null,
    descripcion text,
    categoria varchar(100),
    entradas int default 0,
    salidas int default 0,
    stock int as (entradas - salidas) virtual,
    precio decimal(10,2) not null,
    imagen longblob,
    fecha_regstro datetime default current_timestamp
);

-- Ver los registros actuales de la tabla productos
select * from productos;