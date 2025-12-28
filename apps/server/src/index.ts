import { Hono } from 'hono';
import { cors } from 'hono/cors';
import sessions from './modules/sessions/sessions.controller';
import agents from './modules/agents/agents.controller';

const app = new Hono();

app.use(
  '/api/*',
  cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/api/sessions', sessions);
app.route('/api/agents', agents);

export default app;
