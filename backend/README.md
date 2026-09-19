# MERN Backend Boilerplate (TypeScript)

A minimal, ready-to-extend backend for a MERN stack app, written in TypeScript with Express and Mongoose.

## Stack

- **Express** – HTTP server / routing
- **MongoDB + Mongoose** – database and ODM
- **TypeScript** – type safety
- **ts-node + nodemon** – dev server with auto-reload
- **cors**, **dotenv** – standard middleware/config

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Copy `.env.example` to `.env` and adjust values as needed:

   ```bash
   cp .env.example .env
   ```

   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/mern-boilerplate
   NODE_ENV=development
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Server starts on `http://localhost:5000` (or whatever `PORT` you set), with auto-reload on file changes.

4. **Build & run in production**

   ```bash
   npm run build
   npm start
   ```

## Example API

A working example resource (`User`) is included:

| Method | Route            | Description       |
|--------|------------------|--------------------|
| GET    | `/api/users`     | Get all users      |
| GET    | `/api/users/:id` | Get a single user  |
| POST   | `/api/users`     | Create a user      |
| PUT    | `/api/users/:id` | Update a user      |
| DELETE | `/api/users/:id` | Delete a user      |

Example create request body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}
```
