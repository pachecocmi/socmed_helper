import Fastify from 'fastify';
import { routesConfig } from './routes.js';
import { DatabaseSync } from 'node:sqlite';


const fastify = Fastify({ logger: false });
const PORT = process.env.PORT || 3000;
const sessionDB = new DatabaseSync('./resources/db/sessions.db');

// Enable WAL (Write-Ahead Logging) Mode
// This allows simultaneous reads and writes without locking up the database file
sessionDB.exec("PRAGMA journal_mode = WAL;");

// Set Synchronous to NORMAL
// In WAL mode, NORMAL is completely safe and drastically faster than FULL
sessionDB.exec("PRAGMA synchronous = NORMAL;");

// Enforce Foreign Key Constraints safely
sessionDB.exec("PRAGMA foreign_keys = ON;");

// =========================================================================
// Global Session Gatekeeper Hook
// =========================================================================
fastify.addHook('preHandler', async (request, reply) => {
    const path = request.url;

    const tableQuery = sessionDB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    const tables = tableQuery.all();
    console.log(tables);

    // 1. Mock Session Flag: Change this to true/false to test both behaviors
    // In production, this will check request.session or your secure cookies
    // console.log(request.session);
    const hasActiveSession = request.session ? true : false;

    // 2. Handle the root URL "/" routing matrix explicitly
    if (path === '/') {
        if (hasActiveSession) {
            return reply.redirect('/dashboard');
        } else {
            return reply.redirect('/login');
        }
    }

    // 3. Protect internal pages from unauthenticated access
    // Define an array of paths that REQUIRE a session
    const protectedPaths = ['/dashboard', '/user'];

    if (protectedPaths.includes(path) && !hasActiveSession) {
        // No session? Kick them back to the login page immediately
        return reply.redirect('/login');
    }

    // 4. Prevent logged-in users from seeing the login screen again
    if (path === '/login' && hasActiveSession) {
        return reply.redirect('/dashboard');
    }
});

// =========================================================================
// Register your Route Matrix (Dashboard, Login, User)
// =========================================================================
routesConfig.forEach((route) => {
    fastify.route({
        method: route.method,
        url: route.path,
        handler: route.handler
    });
});

// Fallback for 404s
fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ status: 'error', message: 'Route not found.' });
});

// Boot the Engine
try {
    await fastify.listen({ port: PORT });
    console.log(`[SUCCESS] Gateway active on http://localhost:${PORT}`);
} catch (err) {
    process.exit(1);
}