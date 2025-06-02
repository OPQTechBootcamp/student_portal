const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

// REGISTER
router.post('/register', async (req, res) => {
  const {
    name, email, phone, college, branch, semester,
    linkedin, skills, bio, password, entry_pass_start, entry_pass_end
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO students (
        name, email, phone, college, branch, semester,
        linkedin, skills, bio, password, entry_pass_start, entry_pass_end
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name, email, phone, college, branch, semester,
      linkedin, skills, bio, hashedPassword, entry_pass_start, entry_pass_end
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: "Email already exists" });
        }
        return res.status(500).json({ error: err });
      }

      res.status(201).json({ message: "Student registered successfully", studentId: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

// EDIT PROFILE
router.put('/:id',authenticateToken, (req, res) => {
  const id = req.params.id;
  const {
    name, phone, college, branch, semester,
    linkedin, skills, bio, entry_pass_start, entry_pass_end
  } = req.body;

  const sql = `
    UPDATE students SET
      name = ?, phone = ?, college = ?, branch = ?, semester = ?,
      linkedin = ?, skills = ?, bio = ?, entry_pass_start = ?, entry_pass_end = ?
    WHERE id = ?
  `;

  const values = [
    name, phone, college, branch, semester,
    linkedin, skills, bio, entry_pass_start, entry_pass_end,
    id
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Profile updated successfully" });
  });
});

// GET PROFILE
router.get('/:id', authenticateToken,(req, res) => {
  const id = req.params.id;
  db.query('SELECT id, name, email, phone, college, branch, semester, linkedin, skills, bio, entry_pass_start, entry_pass_end FROM students WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Student not found" });
    res.json(results[0]);
  });
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM students WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Student not found" });

    const student = results[0];
    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword) return res.status(401).json({ message: "Incorrect password" });

    const payload = { id: student.id, email: student.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.json({ token, id: student.id, name: student.name });
  });
});

// Forgot Password (just validates if email exists)
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  db.query('SELECT id FROM students WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Email not registered" });

    res.json({ message: "Student exists. You can now reset your password." });
  });
});

router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  db.query(
    'UPDATE students SET password = ? WHERE email = ?',
    [hashedPassword, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Email not found' });
      res.json({ message: 'Password updated successfully' });
    }
  );
});

module.exports = router;