import { FastifyInstance } from 'fastify';
import fastifyPostgres from '@fastify/postgres';

export enum DB_TABLES {
    POSTS = 'posts'
}; 

export enum POST_COLUMNS {
  ID =  'id',
  TITLE =  'title',
  CONTENT =  'content',
  CATEGORY =  'category',
  TAGS =  'tags',
  CREATED_AT =  'created_at',
  UPDATED_AT =  'updated_at'
}; 

export async function configureDB(fastify:FastifyInstance) {
    
    try {

    fastify.register(fastifyPostgres, {
        connectionString: process.env.DATABASE_URL
    }).then(
       async () => {
    await fastify.pg.query(`
        CREATE TABLE IF NOT EXISTS ${DB_TABLES.POSTS}(
            ${POST_COLUMNS.ID} SERIAL PRIMARY KEY,
            ${POST_COLUMNS.TITLE} VARCHAR(255) NOT NULL,
            ${POST_COLUMNS.CONTENT} TEXT NOT NULL,
            ${POST_COLUMNS.CATEGORY} VARCHAR(100) NOT NULL,
            ${POST_COLUMNS.TAGS} TEXT[] NOT NULL,
            ${POST_COLUMNS.CREATED_AT} TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            ${POST_COLUMNS.UPDATED_AT} TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        `)

       }
    );



       console.log('Database configured successfully');
        
    } catch (error) {
       console.error('Error configuring database:', error);
       throw new Error('Failed to configure database'); 
    }
}