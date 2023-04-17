CREATE DATABASE sistemacr;

CREATE TABLE carreras (
  id_carrera SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  facultad VARCHAR(255)
);

CREATE TABLE usuarios (
  email VARCHAR(255) PRIMARY KEY,
  id_carrera INT,
  hashed_password VARCHAR(255) NOT NULL,
  rol VARCHAR(255),
  CONSTRAINT fk_carrera FOREIGN KEY(id_carrera) REFERENCES carreras(id_carrera)
);

CREATE TABLE solicitudes (
  id_solicitud SERIAL PRIMARY KEY,
  email_usuario VARCHAR(255) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255),
  tipo VARCHAR(255),
  hora_inicio VARCHAR(255),
  hora_final VARCHAR(255),
  CONSTRAINT fk_usuario FOREIGN KEY(email_usuario) REFERENCES usuarios(email)
);

CREATE TABLE materias (
  id_materia SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  uv INT
);

CREATE TABLE materiasXcarreras (
  id_materiasXcarreras SERIAL PRIMARY KEY,
  id_materia INT NOT NULL,
  id_carrera INT NOT NULL,
  CONSTRAINT fk_materia FOREIGN KEY(id_materia) REFERENCES materias(id_materia),
  CONSTRAINT fk_carrera FOREIGN KEY(id_carrera) REFERENCES carreras(id_carrera)
);

CREATE TABLE usuariosXmaterias (
  id_usuariosXmaterias SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  id_materia INT NOT NULL,
  CONSTRAINT fk_usuario FOREIGN KEY(email) REFERENCES usuarios(email),
  CONSTRAINT fk_materia FOREIGN KEY(id_materia) REFERENCES materias(id_materia)
);