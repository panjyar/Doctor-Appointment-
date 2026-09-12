import { pool } from '../config/db.js';

export async function listDoctors(req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, specialty FROM doctors ORDER BY name ASC',
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}
