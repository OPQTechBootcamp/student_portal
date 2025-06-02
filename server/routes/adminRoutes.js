const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authenticateToken = require('../middleware/auth');
// ADMIN LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.json({ token, id: user.id, name: user.name, role: user.role });
  });
});

module.exports = router;


// TEMPORARY: Register first admin (remove after use)
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'admin'],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
          }
          return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: 'Admin registered successfully', userId: result.insertId });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET all students
router.get('/students', authenticateToken, (req, res) => {

  // Optional role check
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  db.query(
    'SELECT id, name, email, phone, college, branch, semester FROM students ORDER BY id DESC',
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// GET student full details
router.get('/student/:id', authenticateToken, (req, res) => {
  const id = req.params.id;

  db.query(
    'SELECT id, name, email, phone, college, branch, semester, linkedin, skills, bio, entry_pass_start, entry_pass_end FROM students WHERE id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ message: 'Student not found' });
      res.json(results[0]);
    }
  );
});

// GET full attendance for student
router.get('/student/:id/attendance', authenticateToken, (req, res) => {
  const id = req.params.id;

  db.query(
    'SELECT date, in_time, out_time FROM attendance WHERE student_id = ? ORDER BY date DESC',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

