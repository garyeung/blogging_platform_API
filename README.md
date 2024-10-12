# Blogging Platform API 

## Description
(https://roadmap.sh/projects/blogging-platform-api)  
This is a simple RESTful API with basic CRUD operations for a personal blogging platform.  
CRUD stands for Create, Read, Update, and Delete.

## Prerequisites
```sh
install postgretsql
install npm@latest 
```
After creatting your own database, rewrite the .env file  with
<code>
DATABASE_URL=postgres://yourusername:yourpassword@yourport/yourdatabase
</code>

## Installation 
```sh
git clone https://github.com/garyeung/blogging_platform_API.git

cd blogging_platform_API 

npm install 
```

## Usage
```sh
npm run dev
or
npm run build
npm run start
```
## Projet Structure
```
/blogging_platform_API
  .env 
  /src
   /_test_
      blog.test.ts
   /controllers
     /routes
       postsRoutes.ts
   /models
     Posts.ts
     configureDB.ts
     /services
       postService.ts
   server.ts
```

## Mechanism
The project built by fastify
- server.ts: to create a fastify instance, then register routes and connect to database

- /models/Posts: the data structure 
- /models/configureDB: connect postgres database 
- /models/services/postService: manipulate database 

- /controllers/routes/postsRoutes: according to the HTTP methods and paths, dispatch the operations

- /\_tests\_/blog.test.ts: for test
