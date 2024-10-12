import { FastifyInstance } from "fastify";
import { PostService } from "../../models/services/postService";
import { Post } from "../../models/Post";

export async function postsRoutes(fastify: FastifyInstance) {

    const postService = new PostService(fastify);

    fastify.post<{Body: Post}>('/posts', async(request, reply) => {
        try {
            const post = await postService.createPost(request.body);

            reply.code(201).send(post);
        }
        catch(err){
            reply.code(400).send({error: 'Invalid post data'});
        }
    })

    fastify.put<{Params: {id: string}; Body: Post}>('/posts/:id', async (request, reply) => {
        const id = parseInt(request.params.id);
        const updatePost = await postService.updatePost(id, request.body);

        if(updatePost){
            reply.code(200).send(updatePost);
        }
        else{
            reply.code(404).send({error: 'Post not found'});
        }
    })

    fastify.delete<{Params: {id: string}}>('/posts/:id', async (request, reply) => {
        const id = parseInt(request.params.id);   
        const deleted = await postService.deletePost(id);

        (deleted)
        ?reply.code(204).send()
        :reply.code(404).send({error: 'Post not found'});

    })
    

    fastify.get<{Params: {id: string}}>('/posts/:id', async (request, reply) => {
        const id = parseInt(request.params.id);
        const post = await postService.getPost(id);

        (post) 
        ?reply.send(post)
        :reply.code(404).send({ error: 'Post not found' });
        
      }
    )

    fastify.get<{Querystring: {term?: string}}>('/posts', async (request, reply) => {
        const {term} = request.query;

        const posts = await postService.getAllPosts(term);

        reply.send(posts);
    })
}