

# Silver-Events : Event Management Application

## Overview

**SilverEvents** is designed for corporate employees to manage and participate in events within their organization. Administrators can create employee accounts, who then receive an email with a token to reset their password. Once logged in, employees can create or join events organized by others. The application also provides profile management, event registration, and comprehensive event filtering capabilities.

## Key Features

- **User Management:**
    - Admins can create accounts for employees.
    - Users receive an email with a token to reset their password.
    - Users can manage their profiles, including updating their name, surname, job title, and profile picture.

- **Event Management:**
    - CRUD operations for events, users, and registrations.
    - Registered users can create, modify, and delete events.
    - Admins have the ability to manage all events, while users can only manage the events they created.
    - Event filtering by date, location, or type.
    - View the list of participants for each event.

- **Notifications:**
    - Automated email reminders for upcoming events.

## Tech Stack

- **Frontend:** [SvelteKit](https://kit.svelte.dev/)
- **Backend:** SvelteKit (using server-side routes with `+server.ts`)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v10 or higher)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Doulla1/SilverEvents.git
    cd SilverEvents
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and populate it with your database and application credentials:

    ```env
    AUTH_SECRET="your_secret_key" # Generate a random string for this
    ADMIN_EMAIL=admin@email.exemple
    ADMIN_PASSWORD=admin_password
    ADMIN_FIRST_NAME=admin_firstname
    ADMIN_LAST_NAME=admin_lastname
    DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public" 
    ```

   Replace `username`, `password`, `dbname`, and other placeholders with your actual credentials.

4. **Run database migrations:**

   Ensure your database is running and then apply the migrations to set up the database schema:

    ```bash
    npx prisma migrate dev --name init
    ```

5. **Seed the database:**

   Populate the database with initial data (roles, admin user, etc.):

    ```bash
    npm run seed
    ```

### Running the Application

To start the development server, run:

```bash
npm run dev
