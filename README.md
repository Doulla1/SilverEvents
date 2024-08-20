# Silver-Events : Event Management Application

## Overview

**SilverEvents** is designed for corporate employees to manage and participate in events within their organization. Administrators can create employee accounts, who then receive an email with a token to reset their password. Once logged in, employees can create or join events organized by others. The application also provides profile management.

## Key Features

- **User Management:**
    - Admins can create accounts for employees.
    - Users receive an email with a token to reset their password.
    - Users can manage their profiles, including updating their name, surname, job title, and profile picture.

- **Event Management:**
    - Registered users can create, modify, and delete events.
    - Users can only manage the events they created.
    - View the list of participants for each event.
  
## V2 Features (not yet there but soon)

- **User Management:**
    - Admins can manage user accounts, including updating user details and deactivating accounts.
    - Admins can manage user roles and permissions.
- **Event Management:**
    - Admins have the ability to manage all events, while users can only manage the events they created.
    - Event filtering by date, location, or type.
    - View the list of participants for each event.

- **Notifications:**
    - Automated email reminders for upcoming events.
    - Notifications for new event registrations.
    - Notifications for new event creation.

## Tech Stack

- **Frontend:** [SvelteKit](https://kit.svelte.dev/)
- **Backend:** SvelteKit (using server-side routes with `+++server.ts`)
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

    Instead of manually creating a `.env` file from scratch, it's recommended to make a copy of the `.env.example` file provided in the repository. This ensures that you have all the required environment variables with the correct structure.

    ```bash
    cp .env.example .env
    ```

    After copying, open the new `.env` file and replace the placeholders with your actual credentials:

    ```env
    AUTH_SECRET="your_secret_key" # Generate a random string for this
    ADMIN_EMAIL=admin@email.example
    ADMIN_PASSWORD=admin_password
    ADMIN_FIRST_NAME=admin_firstname
    ADMIN_LAST_NAME=admin_lastname
    DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public" 
    ```

    Replace `your_secret_key`, `admin_password`, `admin_firstname`, `admin_lastname`, `username`, `password`, `dbname`, and other placeholders with your actual data.

4. **Set up the database:**

   Create a new PostgreSQL database and update the `DATABASE_URL` in the `.env` file with the correct connection string.

5. **Configure your mail server:**

   Update the `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, and `MAIL_PASSWORD` environment variables in the `.env` file with your SMTP server credentials.

6. **Run database migrations:**

   Ensure your database is running and then apply the migrations to set up the database schema:

    ```bash
    npx prisma migrate dev --name init
    ```

    This command will create a new migration with the name `init` and apply it to the database.

7. **Seed the database:**

   Populate the database with initial data (roles, admin user, etc.):

    ```bash
    npm run seed
    ```

    This command will create the admin and member roles, then an admin user with the credentials specified in the `.env` file.

### Running the Application

To start the development server, run:

```bash
npm run dev
