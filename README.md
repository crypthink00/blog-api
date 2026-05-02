# blog-api



Blog API
A RESTful API for a blog platform built with:
* Node.js
* Express
* Prisma
* PostgreSQL (Supabase)
* Redis (optional caching)
* JWT Authentication

 Features
* User registration & login (JWT auth)
* Role-based access control (USER, EDITOR, ADMIN)
* Create, update, delete blog posts
* Pagination & filtering
* Redis caching for performance

Tech Stack
* Node.js + Express
* Prisma ORM
* PostgreSQL (Supabase)
* Redis
* JSON Web Tokens (JWT)

Installation

git clone https://github.com/your-username/blog-api.git
cd blog-api
npm install


Environment Variables
Create a .env file:

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
REDIS_URL=your_redis_url (optional)
PORT=5000


 Database Setup
Run:
npx prisma db push
or
npx prisma migrate dev --name init


▶️ Run the Server
npm run dev
Server runs on:
http://localhost:5000

Authentication
This API uses JWT.
How to authenticate:
1. Login to get token
2. Send token in headers:

Authorization: Bearer YOUR_TOKEN


📮 API Endpoints
🧑 Auth
Register

POST /api/auth/register

Body:

{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}


Login

POST /api/auth/login

Response:
{
  "token": "..."
}


📝 Posts
Get all posts

GET /api/posts?page=1&limit=10

Create post (ADMIN / EDITOR)

POST /api/posts

Headers:

Authorization: Bearer TOKEN

Body:

{
  "title": "My Post",
  "content": "Content here",
  "published": true
}


Update post
PATCH /api/posts/:id


Delete post (ADMIN only)
DELETE /api/posts/:id


Get posts by user
GET /api/posts/user/:id

