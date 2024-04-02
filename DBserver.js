const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'korisnik',
  password: 'password',
  database: 'broken_balance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// GET endpoint
app.get('/scores', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute('SELECT * FROM leaderboard ORDER BY score DESC');
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST endpoint
app.post('/submit', async (req, res) => {
  const { name, score, password, maxhp, AD, AP, Armour, Pen, Cleave, CritP, CritDMG, Level, DMGdone, DMGmitigated, DMGtaken, PhysDMG, APDMG } = req.body;

  try {
    // Get a connection from the pool
    const conn = await pool.getConnection();

    // Check if score for named person already exists
    const [rows] = await conn.execute('SELECT * FROM leaderboard WHERE name = ?', [name]);

    if (rows[0] && rows[0].password === password) {
      // If score for named person already exists, update the existing row
      const [result] = await conn.execute('UPDATE leaderboard SET score = ?, maxhp = ?, AD = ?, AP = ?, Armour = ?, Pen = ?, Cleave = ?, CritP = ?, CritDMG = ?, Level = ?, DMGdone = ?, DMGmitigated = ?, DMGtaken = ?, PhysDMG = ?, APDMG = ? WHERE name = ?', [score, maxhp || null, AD || null, AP || null, Armour || null, Pen || null, Cleave || null, CritP || null, CritDMG || null, Level || null, DMGdone || null, DMGmitigated || null, DMGtaken || null, PhysDMG || null, APDMG || null, name]);
      console.log(`${result.affectedRows} record(s) updated`);
      res.send('Score updated');
    } else if (rows.length > 0 && rows[0].password !== password) {
      // If score for named person already exists but password is incorrect, send an appropriate error message
      res.status(401).send('Incorrect password');
    } else {
      // If score for named person doesn't exist, insert a new row into the table
      const [result] = await conn.execute('INSERT INTO leaderboard (name, password, score, maxhp, AD, AP, Armour, Pen, Cleave, CritP, CritDMG, Level, DMGdone, DMGmitigated, DMGtaken, PhysDMG, APDMG) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, password, score, maxhp || null, AD || null, AP || null, Armour || null, Pen || null, Cleave || null, CritP || null, CritDMG || null, Level || null, DMGdone || null, DMGmitigated || null, DMGtaken || null, PhysDMG || null, APDMG || null]);
      console.log(`${result.affectedRows} record(s) inserted`);
      res.send('Score submitted');
    }    
    console.log('The packet - name: ' + name + ', score: ' + score);

    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
