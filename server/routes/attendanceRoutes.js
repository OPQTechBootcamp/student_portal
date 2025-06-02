const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const db = require('../db');

const getToday = () => new Date().toISOString().split('T')[0];

// Mark IN
router.post('/mark-in', authenticateToken, (req, res) => {
  const { studentId } = req.body;
  const date = getToday();
  const inTime = new Date().toTimeString().split(' ')[0];

  db.query(
    'INSERT INTO attendance (student_id, date, in_time) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE in_time = VALUES(in_time)',
    [studentId, date, inTime],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Entry time marked' });
    }
  );
});

// Mark OUT
router.post('/mark-out', authenticateToken, (req, res) => {
  const { studentId } = req.body;
  const date = getToday();
  const outTime = new Date().toTimeString().split(' ')[0];

  db.query(
    'UPDATE attendance SET out_time = ? WHERE student_id = ? AND date = ?',
    [outTime, studentId, date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Entry not marked yet' });
      res.json({ message: 'Exit time marked' });
    }
  );
});
router.get('/today/:studentId', authenticateToken, (req, res) => {
  const studentId = req.params.studentId;
  const today = new Date().toISOString().split('T')[0];

  db.query(
    'SELECT in_time, out_time FROM attendance WHERE student_id = ? AND date = ?',
    [studentId, today],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results[0] || {}); // if no record, return empty object
    }
  );
});
// GET /api/attendance/history/:studentId
router.get('/history/:studentId', authenticateToken, (req, res) => {
  const { studentId } = req.params;

  const sql = `
    SELECT date, in_time, out_time
    FROM attendance
    WHERE student_id = ?
    ORDER BY date DESC
    LIMIT 30
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;
