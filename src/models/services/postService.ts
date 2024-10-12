import { FastifyInstance } from "fastify";
import { Post } from "../Post";
import { DB_TABLES, POST_COLUMNS } from "../configureDB";

export class PostService {
    constructor(private fastify: FastifyInstance){}

    async createPost(post: Post){
        try {
          const {rows}: {rows: Post[]} = await this.fastify.pg.query(`INSERT INTO ${DB_TABLES.POSTS} (${POST_COLUMNS.TITLE}, ${POST_COLUMNS.CONTENT}, ${POST_COLUMNS.CATEGORY}, tags) VALUES ($1, $2, $3, $4) RETURNING *`, 
          [post.title, post.content, post.category, post.tags]);

          return rows[0];
            
        } catch (error) {
          console.error("Error creating post:", error);
          throw new Error("Could not create post");
            
        }
    }

    async updatePost(id: number, post:Post): Promise<Post | null>{
        try {
          const { rows }: {rows: Post[]} = await this.fastify.pg.query(`UPDATE ${DB_TABLES.POSTS} SET ${POST_COLUMNS.TITLE} = $1, ${POST_COLUMNS.CONTENT} = $2, ${POST_COLUMNS.CATEGORY} = $3, ${POST_COLUMNS.TAGS} = $4, ${POST_COLUMNS.UPDATED_AT} = CURRENT_TIMESTAMP WHERE ${POST_COLUMNS.ID} = $5 RETURNING *`,
              [post.title, post.content, post.category, post.tags, id]
          );
          return rows[0] || null;
        } catch (error) {

          console.error("Error updating post:", error);
          throw new Error("Could not update post");
            
        }

    }

    async deletePost(id:number):Promise<boolean>{
        const {rowCount} = await this.fastify.pg.query(`DELETE FROM ${DB_TABLES.POSTS} WHERE ${POST_COLUMNS.ID} = $1`, [id]);
        return rowCount > 0;
    }

    async getPost(id: number): Promise<Post | null>{
        const {rows} = await this.fastify.pg.query(`SELECT * FROM ${DB_TABLES.POSTS} WHERE ${POST_COLUMNS.ID} = $1`, [id]);

        return rows[0] || null;
    }

    async getAllPosts(term?: string): Promise<Post[]> {
        let query = `SELECT * FROM ${DB_TABLES.POSTS}`;
        const params: string[] = []; 

        if (term) {
            query += ` WHERE ${POST_COLUMNS.TITLE} ILIKE $1 
                        OR ${POST_COLUMNS.CATEGORY} ILIKE $1 
                        OR $1 ILIKE ANY(${POST_COLUMNS.TAGS})`;
            
            params.push(`%${term}%`); // Adding wildcards for partial matching
        }
        
        query += ` ORDER BY ${POST_COLUMNS.CREATED_AT} DESC`;

        const { rows } = await this.fastify.pg.query(query, params);
        return rows;
    }
}