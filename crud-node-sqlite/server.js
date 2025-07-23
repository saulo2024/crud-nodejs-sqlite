const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db/database.sqlite');

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Crie tabela se não existir
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);
});

// Rotas API
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO tasks (name) VALUES (?)', [name], function(err) {
    if (err) throw err;
    res.json({ id: this.lastID });
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', id, function(err) {
    if (err) throw err;
    res.json({ deletedID: id });
  });
});

// Roda servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  
});
