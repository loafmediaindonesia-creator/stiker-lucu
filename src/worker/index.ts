import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('*', cors());

app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'Stiker Lucu API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health/db', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT 1 as test').all();
    return c.json({ database: 'connected', test: results });
  } catch (error) {
    return c.json({ database: 'error', message: String(error) }, 500);
  }
});

app.get('/api/health/r2', async (c) => {
  try {
    const list = await c.env.BUCKET.list({ limit: 1 });
    return c.json({ storage: 'connected', objects: list.objects.length });
  } catch (error) {
    return c.json({ storage: 'error', message: String(error) }, 500);
  }
});

export default app;
