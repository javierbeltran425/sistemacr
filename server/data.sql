CREATE DATABASE sistemacr;

CREATE TABLE usuarios (
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE solicitudes (
  id_solicitud SERIAL PRIMARY KEY,
  email_usuario VARCHAR(255) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255),
  tipo VARCHAR(255),
  CONSTRAINT fk_usuario FOREIGN KEY(email_usuario) REFERENCES usuarios(email)
)