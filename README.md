# Examen Práctico: Backend Music-App

<p align="center">
  Usando el framework de NestJS
</p>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Objetivo

Desarrollar y desplegar una API RESTful escalable utilizando NestJS, PostgreSQL y TypeORM.

## Tecnologías utilizadas

<p> <a href="https://nestjs.com/" target="blank"> <img src="https://nestjs.com/img/logo-small.svg" width="20" alt="NestJS Logo" /> </a> NestJS / Nest CLI </p>
<p> <a href="https://typeorm.io/" target="blank"> <img src="https://raw.githubusercontent.com/typeorm/typeorm/master/resources/logo_big.png" width="20" alt="TypeORM Logo" /> </a> TypeORM </p>
<p> <a href="https://jwt.io/" target="blank"> <img src="https://jwt.io/img/logo-asset.svg" width="20" alt="JWT Logo" /> </a> JWT (Autenticación) </p>
<p> <a href="https://www.postgresql.org/" target="blank"> <img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="20" alt="PostgreSQL Logo" /> </a> PostgreSQL </p>
<p> <a href="https://www.docker.com/" target="blank"> <img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" width="20" alt="Docker Logo" /> </a> Docker </p>
<p> <a href="https://git-scm.com/" target="blank"> <img src="https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png" width="20" alt="Git Logo" /> </a> Git </p>

---

## Ejecución del proyecto

### 🌐 Deployment

El proyecto se encuentra desplegado en Render:

🔗 https://nest-examen-music-api.onrender.com

### 📋 Requisitos previos

Para correr el proyecto localmente necesitas tener instalado:

| Herramienta | Versión recomendada |
|---|---|
| [Git](https://git-scm.com/) | Última estable |
| [Node.js](https://nodejs.org/) | LTS |
| [Nest CLI](http://nestjs.com/) | Última estable |
| [Docker](https://www.docker.com/) | Última estable |
| [PostgreSQL](https://www.postgresql.org/) | 14+ |

### Instalación paso a paso

**Paso 1.** Clona el repositorio:

```bash
git clone https://github.com/RC-Dev07/nest-examen-music-api.git
```

**Paso 2.** Instala las dependencias:

```bash
cd nest-examen-music-api
npm install
```

**Paso 3.** Configura las variables de entorno:

```bash
cp .env.example .env
```

```env
POSTGRES_HOST=your_host
POSTGRES_PORT=your_port
POSTGRES_USERNAME=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=your_database
POSTGRES_SSL=false

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=time_in_seconds_or_string
```

> **Nota:** Si usas Docker, asegúrate de que el `docker-compose.yml` coincida con los valores de tu `.env` y luego ejecuta:
> ```bash
> docker compose up -d
> ```

**Paso 4.** Inicia el servidor en modo desarrollo:

```bash
npm run start:dev
```

---

## Entidades

El sistema cuenta con dos entidades principales relacionadas entre sí.

### 🎤 Artist

Representa a los artistas registrados en la plataforma. Un artista puede publicar múltiples canciones.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `number` | Identificador único (PK, autoincremental) |
| `nombre` | `string` | Nombre del artista |
| `email` | `string` | Email único del artista |
| `password` | `string` | Contraseña encriptada (bcrypt) |
| `rol` | `enum` | Rol del usuario: `ADMIN` \| `ARTIST` |
| `pais` | `string` | País de origen |
| `genero` | `string` | Género musical |
| `anioDebut` | `number` | Año de debut |
| `createdAt` | `Date` | Fecha de creación (auto) |
| `updatedAt` | `Date` | Fecha de última actualización (auto) |

**Relación:**

```typescript
@OneToMany(() => Song, (song) => song.artist)
songs: Song[];
```

---

### 🎵 Song

Representa una canción publicada por un artista. Soporta eliminación lógica mediante `deletedAt`.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `number` | Identificador único (PK, autoincremental) |
| `titulo` | `string` | Título de la canción |
| `duracion` | `number` | Duración en segundos |
| `album` | `string` | Álbum al que pertenece |
| `anioLanzamiento` | `number` | Año de lanzamiento |
| `reproducciones` | `number` | Cantidad de reproducciones |
| `deletedAt` | `Date \| null` | Fecha de eliminación lógica (soft delete) |

**Relación:**

```typescript
@ManyToOne(() => Artist, (artist) => artist.songs)
artist: Artist;
```

---

### 🔗 Diagrama de relaciones

```
┌─────────────────────┐         ┌─────────────────────┐
│       Artist        │         │        Song         │
├─────────────────────┤         ├─────────────────────┤
│ id          (PK)    │ 1     N │ id          (PK)    │
│ nombre              │◄────────│ titulo              │
│ email       (UNIQUE)│         │ duracion            │
│ password            │         │ album               │
│ rol                 │         │ anioLanzamiento     │
│ pais                │         │ reproducciones      │
│ genero              │         │ deletedAt           │
│ anioDebut           │         │ artistId    (FK)    │
│ createdAt           │         └─────────────────────┘
│ updatedAt           │
└─────────────────────┘

Un artista puede tener muchas canciones.
Una canción pertenece a un único artista.
```

---

## Roles del sistema

El sistema maneja dos tipos de usuarios con distintos niveles de acceso:

| Rol | Descripción |
|---|---|
| `ADMIN` | Administrador de la plataforma. Tiene acceso total sobre artistas y canciones. |
| `ARTIST` | Artista registrado. Solo puede gestionar su propio perfil y sus propias canciones. |

### Reglas de persmisos

| Acción | `ADMIN` | `ARTIST` |
|---|---|---|
| Ver artistas | ✅ Todos | ✅ Solo él mismo |
| Crear artista | ✅ | ✅ Solo él mismo |
| Actualizar artista | ✅ Cualquiera | ✅ Solo él mismo |
| Eliminar artista | ✅ | ❌ |
| Ver canciones | ✅ Todas | ✅ Solo las suyas |
| Crear canción | ✅ | ✅ Solo para sí mismo |
| Actualizar canción | ✅ Cualquiera | ✅ Solo las suyas |
| Eliminar canción | ✅ | ✅ Solo las suyas |
| Cambiar artista de canción | ✅ | ❌ |

---

## Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para proteger los endpoints. El módulo de autenticación expone tres rutas bajo el prefijo `/auth`.

### Endpoints

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/auth/register` | Registra un nuevo artista con rol `ARTIST` | Público |
| `POST` | `/auth/register-admin` | Registra un nuevo administrador con rol `ADMIN` | Público* |
| `POST` | `/auth/login` | Inicia sesión y retorna un JWT | Público |

> **Nota:** El endpoint `/auth/register-admin` está destinado únicamente a ser usado por administradores existentes. En una implementación de producción se recomienda protegerlo con un guard de rol `ADMIN`.

---

### `POST /auth/register`

Registra un nuevo usuario con rol `ARTIST`.

**Body:**
```json
{
  "nombre": "string",
  "email": "string",
  "password": "string",
  "pais": "string",
  "genero": "string",
  "anioDebut": 2020
}
```

**Respuestas:**

| Código | Descripción |
|---|---|
| `201` | Usuario registrado correctamente |
| `400` | El email ya está registrado |

---

### `POST /auth/register-admin`

Registra un nuevo usuario con rol `ADMIN`.

**Body:** igual que `/auth/register`

**Respuestas:**

| Código | Descripción |
|---|---|
| `201` | Administrador registrado correctamente |
| `400` | El email ya está registrado |

---

### `POST /auth/login`

Inicia sesión y retorna un token JWT para autenticar las siguientes peticiones.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Respuesta exitosa `200`:**
```json
{
  "access_token": "eyJhbGCJ9..."
}
```

**Respuestas:**

| Código | Descripción |
|---|---|
| `200` | Login exitoso, retorna el JWT |
| `400` | Usuario o contraseña incorrectos |

---

### Uso del token

Una vez obtenido el token, inclúyelo en el header `Authorization` de cada petición protegida:

```http
Authorization: Bearer <access_token>
```

---

## Documentación de la API

La API está documentada con **Swagger UI** y se puede acceder en:

- **Local:** http://localhost:3000/docs
- **Producción:** https://nest-examen-music-api.onrender.com/docs