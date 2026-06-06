require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  connectionTimeout: 15000,
  requestTimeout: 15000,
};

app.get('/api/mensajes', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(
      'SELECT * FROM [dbo].[Chat_Mensaje] ORDER BY Fecha_Envio ASC'
    );
    await pool.close();
    res.json(result.recordset);
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
