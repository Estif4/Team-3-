# Hackathon Boilerplate

## Problem Statement

### Problem 1: Community Lost & Found

People lose items, while others find these items but have no easy way to connect them with their owners.

Build a Lost & Found platform where users can report lost/found items and search existing reports.

#### Milestone 1: Basic CRUD (Score: 50%)

Users can:

- Create a lost/found item report
- View all reports
- View a single report
- Edit their report
- Delete their report

#### Milestone 2: Search & Filtering (Score: 30%)

- Search by title/description
- Filter by category
- Filter by LOST/FOUND
- Filter by location
- Sort by date

#### Milestone 3: Authentication & Ownership (Score: 20%)

- User registration/login
- Only the creator can edit/delete their report
- Show the reporter's information

#### Milestone 4: Matching (Bonus 20%)

Suggest potentially matching reports.

### Problem 2: Real-time Collaborative Task Board

Build a real-time collaborative task board where multiple users can create, edit, move, and delete tasks together live.

#### Milestone 1: Core CRUD + Persistence (Score: 40%)

- Create, read, update, delete tasks
- Move tasks between columns (To Do / In Progress / Done)
- Data persists in MongoDB
- Basic clean UI

#### Milestone 2: Real-time Collaboration (Score: 35%)

- Changes appear live for all connected users (no refresh)
- Multiple users can work at the same time
- Visual indication of who is online

#### Milestone 3: Concurrent Safety & Presence (Score: 25%)

- Safe concurrent editing (no data loss or corruption)
- Show when someone else is currently editing a task
- Basic authentication (display name or simple login)

#### Bonus: Offline Support

- Work offline and sync cleanly when back online
- Basic conflict resolution

### Problem 3: Smart Library Management System

Build a library management system with clear roles and strict borrowing rules.

#### Milestone 1: Basic CRUD + Roles (Score: 40%)

- Librarians can add/edit/delete books and manage copies
- Members can browse books and view their borrowed items
- Simple authentication and role separation (Librarian vs Member)

#### Milestone 2: Borrowing Logic & Rules (Score: 35%)

- Members can borrow and return books
- Enforce rules (max books per member, due dates, availability)
- Prevent over-borrowing and negative stock

#### Milestone 3: Concurrency + Dashboard (Score: 25%)

- Safe concurrent borrowing (last copy cannot be taken by two people at once)
- Librarian dashboard with key stats (total books, borrowed, overdue)
- Clear overdue indicators

#### Bonus

- Real-time updates when books are borrowed/returned
- Simple fine calculation for overdue books

## Project Structure

- `frontend/` - React frontend
- `backend/` - TypeScript backend
