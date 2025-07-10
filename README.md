# Mini Social Network

A fullstack mini social media project built with **Next.js**, **NestJS**, **PostgreSQL**, and **Socket.io**. Features include post infinite scroll, likes, comments, real-time chat, and an admin dashboard.
## Demo
![Demo Screenshot](frontend-nextjs/public/demo/homepage.png)
![Demo Screenshot 2](frontend-nextjs/public/demo/homepage2.png)

## Frontend
- Next.js, ReactJS, TypeScript
- Ant Design, Axios, Auth.js
- Socket.io-client

## Backend
- NestJS, TypeORM
- PostgreSQL
- JWT + Passport Authentication
- Multer (image upload), Throttler (rate limiting)
- Socket.io

---

# Installation & Setup

## 1.Clone the Repository
git clone https://github.com/minhquan2703/mini_socialmedia.git
cd mini_socialmedia
## 2. Install Dependencies, Create file storing environment variables (file .env) and run project
### Backend
1. cd backend-nestjs
2. npm install
3. Create file .env
PORT=8081
DB_USERNAME="..."
DB_PASSWORD="..."
DB_DATABASE="..."
DB_PORT=5432 (This port for postgreSQL. If you don't use postgreSQL, seach documentation about your database's port)
BACKEND_URL=http://localhost:8081
FRONTEND_URL=http://localhost:3000
JWT_SECRET= Take uuid and paste here -> [uuid_generator_homepage](https://www.uuidgenerator.net/)
JWT_ACCESS_TOKEN_EXPIRED=365d
MAIL_USER="google mail"
MAIL_PASSWORD= Create your app password -> [your application google password](https://support.google.com/accounts/answer/185833?hl=en)

-> Example file .env:
PORT=8081
DB_USERNAME=admin
DB_PASSWORD=111111
DB_DATABASE=socialNetworking
DB_PORT=5432
BACKEND_URL=http://localhost:8081
FRONTEND_URL=http://localhost:3000
JWT_SECRET=7601e326-eb9a-4a62-9c7d-7994a6a49c54
JWT_ACCESS_TOKEN_EXPIRED=365d 
MAIL_USER=quan.product02073@gmail.com
MAIL_PASSWORD=gaseeapfawokzxiviz
4. npm run dev
### Frontend
1. cd frontend-nextjs
2. npm install
3. Create file .env.local
AUTH_SECRET= Take uuid and paste here -> [uuid_generator_homepage](https://www.uuidgenerator.net/)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081

-> Example file .env.local:
AUTH_SECRET=7601e326-eb9a-4a62-9c7d-7994a6a49c54
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
4. npm run dev
## 3. run http://localhost:3000/ in your browser (google chrome was recommended)
