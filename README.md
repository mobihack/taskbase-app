![Logo](./client/public/taskbase-logo.png)

# TaskBase

Simple trello-like task management app enabling users to manage, view and filter tasks for better organization.

## Install

Clone the repo to your local machine

Install frontend dependencies

```bash
  cd ./client
  yarn install
```

Install backend dependencies

```bash
  cd ./server
  yarn install
```

## Run Locally

You have to start both applications simultaneously to run locally.

Start frontend:

```bash
  cd ./client

  yarn dev

  # or

  yarn build
  yarn start
```

Start backend:

```bash
  cd ./server

  yarn dev

  # or

  yarn build
  yarn start
```

## Running Tests

To run tests, run the following command

Test frontend:

```bash
  cd ./client
  yarn test
```

## Tech Stack

**Client:** React, React Icons, SWR, Dnd kit, RadixUI, TailwindCSS, Zod

**Server:** NodeJS, Express, TypeORM, JSONWebToken, SQLite3, Zod

## License

[MIT](./LICENSE.md)
