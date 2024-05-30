const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());

// API routes
app.get('/api/items', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM items');
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// API route to create a new item
app.post('/api/items', async (req, res) => {
  try {
    const { name, description, quantity } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO items (name, description, quantity) VALUES ($1, $2, $3) RETURNING *',
      [name, description, quantity]
    );
    res.status(201).json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// API route to update an item
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE items SET name = $1, description = $2, quantity = $3 WHERE id = $4 RETURNING *',
      [name, description, quantity, id]
    );
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
