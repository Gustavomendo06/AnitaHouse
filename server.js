const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // usamos sqlite3 em vez de better-sqlite3
const bodyParser = require('body-parser');

const db = new sqlite3.Database('anitaHouse.db', (err) => {
  if (err) {
    console.error('Erro ao abrir a base de dados:', err.message);
  } else {
    console.log('Base de dados conectada com sucesso.');
  }
});

app.use(bodyParser.json());

// Servir HTML/CSS/JS da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de check-in
app.post('/checkin', (req, res) => {
  const {
    name, birthDate, birthPlace, nationality,
    residencePlace, residenceCountry,
    documentType, documentNumber, documentIssuer,
    checkinDate, checkoutDate
  } = req.body;

  const query = `
    INSERT INTO Hospedes (
      Nome, DataNascimento, LocalNascimento, Nacionalidade,
      LocalResidencia, PaisResidencia, TipoDocumento, NumeroDocumento,
      PaisEmissor, DataCheckin, DataCheckout
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    name, birthDate, birthPlace, nationality,
    residencePlace, residenceCountry,
    documentType, documentNumber, documentIssuer,
    checkinDate, checkoutDate
  ], function(err) {
    if (err) {
      console.error('Erro ao inserir no banco de dados:', err.message);
      res.status(500).json({ message: 'Erro ao guardar check-in' });
    } else {
      res.status(200).json({ message: 'Check-in guardado com sucesso!' });
    }
  });
});

// Rota para listar hóspedes
app.get("/listar", (req, res) => {
  db.all("SELECT * FROM Hospedes", [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar dados:", err.message);
      res.status(500).send("Erro ao obter os dados");
    } else {
      res.json(rows);
    }
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor a correr em http://localhost:${PORT}`));
