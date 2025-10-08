import pool from '../config/database.js'

export async function getAllEvents(_req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT e.*, l.name AS location_name
       FROM events e JOIN locations l ON e.location_id = l.id
       ORDER BY e.start_time ASC;`
    )
    res.status(200).json(rows)
  } catch (error) { res.status(409).json({ error: error.message }) }
}

export async function getEventById(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT e.*, l.name AS location_name
       FROM events e JOIN locations l ON e.location_id = l.id
       WHERE e.id = $1;`,
      [req.params.id]
    )
    res.status(200).json(rows[0] ?? null)
  } catch (error) { res.status(409).json({ error: error.message }) }
}
