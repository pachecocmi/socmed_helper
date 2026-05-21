import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// Your regular routes and ATTACH DATABASE files here
fastify.get('/', async (request, reply) => {
    return { status: "multitool online", db: "connected" };
});

fastify.get('/api/test', async (request, reply) => {
    return { message: "peer review endpoint open" };
});

// Vercel handles the execution container automatically.
// Just leave your standard listen call for local WSL execution:
const port = process.env.PORT || 3000;
fastify.listen({ port: parseInt(port), host: '0.0.0.0' }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});