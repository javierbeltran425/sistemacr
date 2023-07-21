CREATE DATABASE sistemacr;

CREATE TABLE carreras (
  id_carrera TEXT PRIMARY KEY,
  nombre TEXT,
  facultad TEXT
);

CREATE TABLE usuarios (
  id_usuario TEXT PRIMARY KEY,
  id_carrera TEXT,
  email TEXT NOT NULL UNIQUE,
  hashed_password TEXT NOT NULL,
  nombre TEXT,
  activo BOOLEAN DEFAULT(false),
  rol TEXT,
  CONSTRAINT fk_carrera FOREIGN KEY(id_carrera) REFERENCES carreras(id_carrera) ON DELETE SET NULL
);

CREATE TABLE materias (
  id_materia TEXT PRIMARY KEY,
  nombre TEXT,
  uv INT
);

CREATE TABLE secciones (
  id_seccion TEXT PRIMARY KEY,
  id_materia TEXT,
  id_profesor TEXT,
  numero INT,
  CONSTRAINT fk_materia FOREIGN KEY(id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE,
  CONSTRAINT fk_profesor FOREIGN KEY(id_profesor) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

CREATE TABLE solicitudes (
  id_solicitud SERIAL PRIMARY KEY,
  id_usuario TEXT,
  id_materia TEXT,
  id_seccion TEXT,
  titulo TEXT,
  descripcion TEXT,
  tipo TEXT,
  estado TEXT,
  hora_inicio TEXT,
  hora_final TEXT,
  archivada BOOLEAN DEFAULT(false),
  CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_materia FOREIGN KEY (id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE,
  CONSTRAINT fk_seccion FOREIGN KEY (id_seccion) REFERENCES secciones(id_seccion) ON DELETE CASCADE
);

CREATE TABLE horarios (
  id_horario SERIAL PRIMARY KEY,
  id_usuario TEXT,
  id_materia TEXT,
  id_seccion TEXT,
  identificador INT,
  titulo TEXT,
  descripcion TEXT,
  hora_inicio TEXT,
  hora_final TEXT,
  CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_materia FOREIGN KEY(id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE,
  CONSTRAINT fk_seccion FOREIGN KEY (id_seccion) REFERENCES secciones(id_seccion) ON DELETE CASCADE
);

CREATE TABLE materiasXcarreras (
  id_materiasXcarreras SERIAL PRIMARY KEY,
  id_materia TEXT,
  id_carrera TEXT,
  CONSTRAINT fk_materia FOREIGN KEY(id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE,
  CONSTRAINT fk_carrera FOREIGN KEY(id_carrera) REFERENCES carreras(id_carrera) ON DELETE CASCADE
);

CREATE TABLE usuariosXmaterias (
  id_usuariosXmaterias SERIAL PRIMARY KEY,
  id_usuario TEXT,
  id_materia TEXT,
  id_seccion TEXT,
  CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_materia FOREIGN KEY(id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE,
  CONSTRAINT fk_seccion FOREIGN KEY(id_seccion) REFERENCES secciones(id_seccion) ON DELETE CASCADE
);

/*

### Query para crear usuario administrador en caso de perdida de acceso ###
  email: admin@uca.edu.sv
  contraseña: 

INSERT INTO USUARIOS (id_usuario, email, hashed_password, rol)
VALUES('admin', 'admin@uca.edu.sv', '$2b$10$8GMI1pz7/k6tYYmnzmbnO./4kxXrsoe4LR9fmMYnKu6xvVCqHny/2', 'admin');

*/
