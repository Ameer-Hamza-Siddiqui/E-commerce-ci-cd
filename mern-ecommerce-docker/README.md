# MERN E-Commerce Website

This is a beginner-friendly MERN Stack E-Commerce project with Docker, Docker Compose, and GitHub Actions CI/CD.

## Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js
- Docker
- GitHub Actions

## Features

- User register
- User login
- JWT authentication
- Product list
- Add sample products
- Add to cart
- Place order
- MongoDB database
- Docker Compose setup
- GitHub Actions CI/CD workflow

## Folder Structure

```text
mern-ecommerce-docker/
├── backend/
├── frontend/
├── docker-compose.yml
├── .github/workflows/ci-cd.yml
└── README.md
```

## Run with Docker

Open terminal in project root folder and run:

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

Products API:

```text
http://localhost:5000/api/products
```

## Add Sample Products

Open frontend and click:

```text
Add Sample Products
```

Or use API:

```bash
curl -X POST http://localhost:5000/api/products/seed
```

## Stop Project

```bash
docker compose down
```

## Run Without Docker

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## GitHub Actions CI/CD

The workflow file is available here:

```text
.github/workflows/ci-cd.yml
```

It builds backend and frontend Docker images, starts the project using Docker Compose, tests the backend route, and then stops containers.
