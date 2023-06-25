CREATE DATABASE sistemacr;

CREATE TABLE carreras (
  id_carrera SERIAL PRIMARY KEY,
  nombre VARCHAR(255),
  facultad VARCHAR(255)
);

CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  id_carrera INT,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255),
  rol VARCHAR(255),
  CONSTRAINT fk_carrera FOREIGN KEY(id_carrera) REFERENCES carreras(id_carrera)
);

CREATE TABLE materias (
  id_materia SERIAL PRIMARY KEY,
  nombre VARCHAR(255),
  uv INT
);


CREATE TABLE solicitudes (
  id_solicitud SERIAL PRIMARY KEY,
  id_usuario INT,
  id_profesor INT,
  id_materia INT,
  titulo VARCHAR(255),
  descripcion VARCHAR(255),
  tipo VARCHAR(255),
  hora_inicio VARCHAR(255),
  hora_final VARCHAR(255),
  estado VARCHAR(255),
  CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_profesor FOREIGN KEY (id_profesor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_materia FOREIGN KEY (id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE
);

CREATE TABLE horarios (
  id_horario SERIAL PRIMARY KEY,
  id_usuario INT,
  id_materia INT,
  identificador INT,
  titulo VARCHAR(255),
  descripcion VARCHAR(255),
  hora_inicio VARCHAR(255),
  hora_final VARCHAR(255),
  CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_materia FOREIGN KEY(id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE
);

CREATE TABLE materiasXcarreras (
  id_materiasXcarreras SERIAL PRIMARY KEY,
  id_materia INT NOT NULL,
  id_carrera INT NOT NULL,
  CONSTRAINT fk_materia FOREIGN KEY(id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE,
  CONSTRAINT fk_carrera FOREIGN KEY(id_carrera) REFERENCES carreras(id_carrera) ON DELETE CASCADE
);

CREATE TABLE usuariosXmaterias (
  id_usuariosXmaterias SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_materia INT NOT NULL,
  id_profesor INT,
  CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_profesor FOREIGN KEY(id_profesor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_materia FOREIGN KEY(id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE
);