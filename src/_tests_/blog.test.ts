import { FastifyInstance } from "fastify";
import { build } from '../server';
import supertest from "supertest";
import { Post } from "../models/Post";

describe('Blog API', () => {
    let app: FastifyInstance;
    let createdPostId: number;
    const testPost: Post = {
        title: 'Test Post',
        content: "This is a test post content.",
        category: 'Test',
        tags: ["test", "api"]
    };

    const updatedPost: Post = {
        title: 'Updated Test Post',
        content: 'This is an updated test post content.',
        category: 'Updated Test',
        tags: ['updated', 'test', 'api']
    };

    beforeAll(async () => {
        app = await build();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    // Create a post
    test('POST /posts - Create a new blog post', async () => {
        const response = await supertest(app.server)
            .post('/posts')
            .send(testPost)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.content).toBe(testPost.content);
        expect(response.body.category).toBe(testPost.category);
        expect(response.body.tags).toEqual(expect.arrayContaining(testPost.tags));

        createdPostId = response.body.id;
    });

    // Get all posts
    test('GET /posts - Retrieve all blog posts', async () => {
        const response = await supertest(app.server)
            .get('/posts')
            .expect(200);

        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    // Get a specific post 
    test('GET /posts/:id - Retrieve a specific blog post', async () => {
        const response = await supertest(app.server)
            .get(`/posts/${createdPostId}`)
            .expect(200);

        expect(response.body.id).toBe(createdPostId);
        expect(response.body.title).toBe(testPost.title);
    });

    // Update a post 
    test('PUT /posts/:id - Update a blog post', async () => {
        const response = await supertest(app.server)
            .put(`/posts/${createdPostId}`)
            .send(updatedPost)
            .expect(200);

        expect(response.body.id).toBe(createdPostId);
        expect(response.body.title).toBe(updatedPost.title);
        expect(response.body.content).toBe(updatedPost.content);
        expect(response.body.category).toBe(updatedPost.category);
        expect(response.body.tags).toEqual(expect.arrayContaining(updatedPost.tags));
    });

    // Delete a post
    test('DELETE /posts/:id - Delete a blog post', async () => {
        await supertest(app.server)
            .delete(`/posts/${createdPostId}`)
            .expect(204);

        // Verify the post has been deleted
        await supertest(app.server)
            .get(`/posts/${createdPostId}`)
            .expect(404);
    });

    // Get posts by search term (category, tag, or title)
    test('GET /posts?term=:searchTerm - Retrieve posts by search term', async () => {
        // Create a new post for testing search
        const searchPost: Post = {
            title: 'Search Test Post',
            content: 'This is a post for testing search functionality.',
            category: 'SearchCategory',
            tags: ['search', 'test']
        };

        const createResponse = await supertest(app.server)
            .post('/posts')
            .send(searchPost)
            .expect(201);

        const searchPostId = createResponse.body.id;

        // Test search by category
        const categoryResponse = await supertest(app.server)
            .get(`/posts?term=${encodeURIComponent(searchPost.category)}`)
            .expect(200);

        expect(Array.isArray(categoryResponse.body)).toBeTruthy();
        expect(categoryResponse.body.length).toBeGreaterThan(0);
        expect(categoryResponse.body[0].category).toBe(searchPost.category);

        // Test search by tag
        const tagResponse = await supertest(app.server)
            .get(`/posts?term=${encodeURIComponent(searchPost.tags[0])}`)
            .expect(200);

        expect(Array.isArray(tagResponse.body)).toBeTruthy();
        expect(tagResponse.body.length).toBeGreaterThan(0);
        expect(tagResponse.body[0].tags).toContain(searchPost.tags[0]);

        // Test search by title
        const titleResponse = await supertest(app.server)
            .get(`/posts?term=${encodeURIComponent(searchPost.title)}`)
            .expect(200);

        expect(Array.isArray(titleResponse.body)).toBeTruthy();
        expect(titleResponse.body.length).toBeGreaterThan(0);
        expect(titleResponse.body[0].title).toBe(searchPost.title);

        // Clean up: delete the search test post
        await supertest(app.server)
            .delete(`/posts/${searchPostId}`)
            .expect(204);
    });
});