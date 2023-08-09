# sistemacr

1. [Preparar entorno de desarrollo](#preparar-entorno-de-desarrollo)
2. [Preparar para producción](#preparar-para-producción)
3. [Bibliografía](#bibliografía)

## Preparar entorno de desarrollo

### Pre-requisitos

- node version >= 18
- instancia de Postgres database version >= 15
- Servidor de correo electrónico

### Script de la base de datos Postgres

```
sistemacr
└─ init.sql
```

### Instalación

```
git clone https://github.com/javierbeltran425/sistemacr
cd server
npm install
cd ../client
npm install
cd ..
```

### Llenar variables de entorno

**.env server**

```
touch server/.env
```

```
PORT=   //puerto en el que escucha el servidor
BASE_PATH=  //prefijo de todas las rutas API

# SECRET KEY JWT
ACCESS_TOKEN_SECRET=    //secreto token de acceso
REFRESH_TOKEN_SECRET=   //secreto token para refrescar sesión

# DATABASE CREDENTIALS
DB_USER=    //usuario de la base de datos
DB_PASS=    //contraseña base de datos
DB_HOST=    //host base de datos
DB_NAME=    //nombre de la base de datos
DB_PORT=    //puerto de la base de datos

# MAIL SERVICE
NODEM_USER= //email para utilizar la API de google para mensajería (Gmail API)
NODEM_PASSWORD= //contraseña para utilizar la API de google para mensajería
```

**.env client**

```
touch client/.env
```

```
REACT_APP_SERVER_URL= //url de consultas al servidor

ESLINT_NO_DEV_ERRORS=true   //configuración de eslint
DISABLE_ESLINT_PLUGIN=true  //configuración de eslint
```

### Opciones de CORS

Agregar la URL del cliente al siguiente archivo

```
sistemacr
    └─ server
       └─ config
          └─ allowedOrigins
```

### Correr la aplicación

```
cd server
npm run start
cd ../client
npm run start
cd ..
```

## Preparar para producción

### Pre-requisitos

- Docker
- Servidor de correo electrónico

### Llenar variables de entorno

```
touch .env
```

```
# CLIENT

REACT_APP_SERVER_URL=   //url de consultas al servidor
ESLINT_NO_DEV_ERRORS=true   //configuración de eslint
DISABLE_ESLINT_PLUGIN=true  //configuración de eslint


# SERVER

PORT=8000   //puerto en el que escucha el servidor
BASE_PATH='/'   //prefijo de todas las rutas API

# SECRET KEY JWT
ACCESS_TOKEN_SECRET=    //secreto token de acceso
REFRESH_TOKEN_SECRET=   //secreto para refrescar la sesión

# DATABASE CREDENTIALS
POSTGRES_USER=  //usuario de la base de datos
POSTGRES_PASSWORD=  //constraseña de la base de datos
POSTGRES_DB=    //nombre de la base de datos
POSTGRES_LOCAL_PORT=    //puerto de la base de datos

# MAIL SERVICE
NODEM_USER= //email para utilizar la API de google para mensajería (Gmail API)
NODEM_PASSWORD= //contraseña para utilizar la API de google para mensajería
```

### Opciones de CORS

Agregar la URL del cliente al siguiente archivo

```
sistemacr
    └─ server
       └─ config
          └─ allowedOrigins
```

### Montar la aplicación

```
sudo docker-compose up --build
```

## Bibliografía

- Dave Gray. (2022, January 28). React Login Authentication with JWT Access, Refresh Tokens, Cookies and Axios [Video]. YouTube. https://www.youtube.com/watch?v=nI8PYZNFtac
