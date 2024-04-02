const mysql = require('mysql2/promise');

async function getScores() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'korisnik',
    password: 'password',
    database: 'broken_balance'
  });

  const [rows, fields] = await connection.execute('SELECT * FROM leaderboard ORDER BY score DESC');
  console.log(rows);
}

getScores();