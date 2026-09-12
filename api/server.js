import 'dotenv/config';
import app from './src/app.js';
import { pool } from './src/config/db.js';

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('Connected to PostgreSQL.');

    app.listen(port, () => {
      console.log(`API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error.message);
    process.exit(1);
  }
}

startServer();
