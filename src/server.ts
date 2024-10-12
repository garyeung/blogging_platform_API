import Fastify, { FastifyInstance } from "fastify";
import { configureDB } from "./models/configureDB";
import { postsRoutes } from "./controllers/routes/postsRoutes";
import dotenv from 'dotenv';

dotenv.config();


export async function build(){
     const server = Fastify({
        logger: true
     });
      server.register(postsRoutes);
      await configureDB(server);

      return server;
}


async function start(server: FastifyInstance) {
    try {
       await server.listen({port: 3000});
       console.log('Server is running on http://localhost:3000');

    } catch (error) {
       console.error(error);
       process.exit(1);
    }
}

if(require.main === module){

    build().then((server) => {
   start(server);
    })
}