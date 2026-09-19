# Real-Time Collaborative Task Board — Team Build Doc

## 0. Strategy in one paragraph

REST handles all persistence (create/read/update/delete tasks) — this is what
everyone already knows how to write fast and correctly. **Socket.io is used
only for broadcasting "something changed" and presence/editing indicators**,
not for persistence itself. This hybrid means: if sockets break under time
pressure, the app still works as a normal CRUD board with a manual refresh —
you degrade gracefully instead of losing everything.

Build order (don't reorder this): **Milestone 1 fully working → Milestone 2
(sockets) → Milestone 3 (concurrency + presence) → Bonus (offline) only if
time remains.**

---

## 1. Tech stack

- Backend: Express, Mongoose, **Socket.io** (new), JWT auth, bcrypt
- Frontend: React (Vite), `socket.io-client` (new), Context for auth + socket
- DB: MongoDB

---

## 2. Folder structure — feature-based

Since their boilerplate is feature-based, group by _domain_, not by file type.
Every feature owns its own model/controller/route/service — nothing is
scattered across a global `models/` or `controllers/` folder.

```
server/
  src/
    features/
      auth/
        auth.model.js         # User schema
        auth.service.js       # business logic
        auth.controller.js    # req/res only
        auth.routes.js
      tasks/
        task.model.js          # Task schema
        task.service.js        # CRUD + concurrency logic
        task.controller.js
        task.routes.js
      realtime/
        socket.js              # io.on('connection', ...) setup
        presence.js             # in-memory online-users tracking
    middleware/
      auth.middleware.js       # protect, restrictTo (reuse from last night)
      error.middleware.js
    config/
      db.js
    utils/
      generateToken.js
    app.js                     # express app config (no listen here)
    server.js                  # http server + io.attach + app.listen

client/
  src/
    features/
      auth/
        api/authApi.js
        LoginForm.jsx
        AuthContext.jsx
      board/
        api/taskApi.js
        Board.jsx
        Column.jsx
        TaskCard.jsx
        TaskForm.jsx
        useBoardSocket.js       # hook: wires socket events to board state
      presence/
        OnlineUsers.jsx
        usePresence.js
    shared/
      socket.js                 # single shared socket.io-client instance
      api.js                    # fetch wrapper (reuse from last night)
    App.jsx
    main.jsx
```

**Why feature-based matters here specifically:** two people can work on
`features/tasks/` and `features/realtime/` in parallel without touching the
same files — critical for a team under time pressure.

---

## 3. Schema

### User (`auth/auth.model.js`)

```js
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
}
// timestamps: true
```

Reuse exactly the pattern from last night (bcrypt pre-save hook,
matchPassword method). Don't reinvent this — it's proven and it's not where
your time should go today.

### Task (`tasks/task.model.js`)

```js
{
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  column: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  order: { type: Number, default: 0 },        // position within its column
  createdBy: { type: ObjectId, ref: 'User', required: true },

  // --- concurrency safety (Milestone 3) ---
  version: { type: Number, default: 0 },       // bumped on every update

  // --- editing indicator (Milestone 3) ---
  editingBy: {
    userId: { type: ObjectId, ref: 'User' },
    name: String,
    since: Date,
  },
}
// timestamps: true
```

**Why `version` exists:** it's how you satisfy "safe concurrent editing, no
data loss" without anything exotic. Every update request must send the
`version` it last read. If it doesn't match the DB's current version, someone
else changed the task first — reject with 409, client refetches. This is
optimistic concurrency control, the standard, interview-safe way to solve
this — not locks, not merging.

**Why `editingBy` lives on the document (not just in-memory):** if the field
is in Mongo, a `GET /tasks` on page load already shows who's editing what,
no extra round-trip needed.

---

## 4. REST routes

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/tasks              # full board state, all columns
POST   /api/tasks              # create
PUT    /api/tasks/:id          # update (title/description/column/order) — requires version
DELETE /api/tasks/:id
```

Note there's **no separate "move" route** — moving a task between columns is
just `PUT /api/tasks/:id` with a new `column` and `order` value. Don't build
a special endpoint for it; it adds complexity for no benefit.

Every mutating route (`POST`/`PUT`/`DELETE`), after successfully writing to
Mongo, does one extra thing: emits a Socket.io event to every _other_
connected client. This is the one new habit to build into every controller
today.

---

## 5. Socket.io events

### Connection lifecycle

```
client → server:  'board:join'   { userId, name }
server → all:     'presence:update'   [{ userId, name }, ...]
(on disconnect, server removes from presence map, re-broadcasts)
```

### Task changes (server broadcasts after REST write succeeds)

```
server → all:  'task:created'   { task }
server → all:  'task:updated'   { task }
server → all:  'task:deleted'   { taskId }
```

Client-side: on receiving these, update local state directly (no refetch
needed) — that's what makes it feel "live."

### Editing indicator (Milestone 3)

```
client → server:  'editing:start'  { taskId, userId, name }
server → all:     'editing:update' { taskId, editingBy: { userId, name } }

client → server:  'editing:stop'   { taskId }
server → all:     'editing:update' { taskId, editingBy: null }
```

Trigger `editing:start` on the task form's focus/open, `editing:stop` on
blur/save/close. Keep this simple — don't try to build cursor-tracking or
character-level collab, that's far beyond what's scored here.

---

## 6. Concurrency & conflict handling (Milestone 3, 25%)

On the server, task update logic:

```js
const updateTask = async (id, updates, clientVersion) => {
  const task = await Task.findOneAndUpdate(
    { _id: id, version: clientVersion }, // only matches if versions agree
    { ...updates, $inc: { version: 1 } },
    { new: true },
  );
  if (!task) {
    const err = new Error(
      "This task was changed by someone else — refresh and retry",
    );
    err.statusCode = 409;
    throw err;
  }
  return task;
};
```

This is the exact same atomic-update trick as last night's stock decrement —
same shape, different field. On the frontend, a 409 should show a toast/alert
and trigger a refetch of that one task, not a silent failure.

---

## 7. Bonus: offline support (only attempt after 1–3 are solid)

Simplest version that satisfies the bonus without a rabbit hole:

- On `navigator.onLine === false`, queue mutations (create/update/delete) in
  an array in memory or localStorage instead of firing the fetch.
- On `window.addEventListener('online', ...)`, replay the queue against the
  REST API in order.
- If a replayed update gets a 409 (conflict), don't auto-resolve — just show
  it to the user and let them redo it manually. A full merge strategy is not
  worth the time today; "detect and surface" beats "silently guess."

---

## 8. Suggested team split (for however many people you have)

- **Person A:** Auth (reuse last night's code almost verbatim) + `task.model.js` + `task.service.js`/controller/routes (Milestone 1 backend)
- **Person B:** Board UI — `Board.jsx`, `Column.jsx`, `TaskCard.jsx`, drag/move interaction (Milestone 1 frontend)
- **Person C:** `realtime/socket.js` server setup + `useBoardSocket.js` client hook (Milestone 2, starts once Milestone 1's REST routes exist)
- Whoever finishes first picks up presence + editing indicators (Milestone 3), then offline support (bonus) if time allows

Everyone should be able to work off this doc without waiting on each other,
since features are folder-isolated.

---

## 9. Step-by-step build order (don't skip ahead)

1. Auth working end-to-end (register/login/JWT) — copy from last night
2. `Task` model + full CRUD REST routes, tested with curl/Postman — no sockets yet
3. Frontend board rendering tasks from `GET /api/tasks`, create/edit/delete working via REST, manual refresh to see changes — this alone satisfies Milestone 1
4. Add Socket.io server (`io.on('connection')`, join board room), emit `task:created/updated/deleted` after each successful REST write
5. Frontend: connect `socket.io-client` once (shared instance), listen for those three events, update state directly — this satisfies Milestone 2
6. Add `version` field + optimistic concurrency check to update route
7. Add `editingBy` field + `editing:start`/`editing:stop` events + UI badge ("Alice is editing") — this satisfies Milestone 3
8. Only now, if time remains: offline queue + replay (bonus)
